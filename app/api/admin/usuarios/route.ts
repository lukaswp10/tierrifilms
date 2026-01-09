import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Nao autenticado' },
        { status: 401 }
      );
    }

    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Sem permissao para criar usuarios' },
        { status: 403 }
      );
    }

    const { email, nome, senha, role } = await request.json();

    if (!email || !nome || !senha) {
      return NextResponse.json(
        { error: 'Email, nome e senha sao obrigatorios' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter no minimo 6 caracteres' },
        { status: 400 }
      );
    }

    const { data: existente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existente) {
      return NextResponse.json(
        { error: 'Este email ja esta cadastrado' },
        { status: 400 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        email: email.toLowerCase(),
        nome,
        senha_hash: senhaHash,
        role: role || 'editor',
      }])
      .select('id, email, nome, role')
      .single();

    if (error) {
      console.error('Erro ao criar usuario:', error);
      return NextResponse.json(
        { error: 'Erro ao criar usuario' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, usuario: data });
  } catch (err) {
    console.error('Erro:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Alterar senha (propria ou resetar editor)
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Nao autenticado' },
        { status: 401 }
      );
    }

    const { targetUserId, senhaAtual, novaSenha, reset } = await request.json();

    // Validar nova senha
    if (!novaSenha || novaSenha.length < 6) {
      return NextResponse.json(
        { error: 'Nova senha deve ter no minimo 6 caracteres' },
        { status: 400 }
      );
    }

    // MODO 1: Alterar propria senha (qualquer usuario)
    if (!reset && !targetUserId) {
      // Precisa da senha atual
      if (!senhaAtual) {
        return NextResponse.json(
          { error: 'Senha atual e obrigatoria' },
          { status: 400 }
        );
      }

      // Buscar usuario atual com senha_hash
      const { data: usuario } = await supabaseAdmin
        .from('usuarios')
        .select('id, senha_hash')
        .eq('id', session.id)
        .single();

      if (!usuario) {
        return NextResponse.json(
          { error: 'Usuario nao encontrado' },
          { status: 404 }
        );
      }

      // Verificar senha atual
      const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha_hash);
      if (!senhaCorreta) {
        return NextResponse.json(
          { error: 'Senha atual incorreta' },
          { status: 400 }
        );
      }

      // Atualizar senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      const { error } = await supabaseAdmin
        .from('usuarios')
        .update({ senha_hash: novaSenhaHash })
        .eq('id', session.id);

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        return NextResponse.json(
          { error: 'Erro ao atualizar senha' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'Senha alterada com sucesso' });
    }

    // MODO 2: Admin resetar senha de editor
    if (reset && targetUserId) {
      // Apenas admin pode resetar
      if (session.role !== 'admin') {
        return NextResponse.json(
          { error: 'Sem permissao para resetar senhas' },
          { status: 403 }
        );
      }

      // Buscar usuario alvo
      const { data: targetUser } = await supabaseAdmin
        .from('usuarios')
        .select('id, role, email')
        .eq('id', targetUserId)
        .single();

      if (!targetUser) {
        return NextResponse.json(
          { error: 'Usuario nao encontrado' },
          { status: 404 }
        );
      }

      // Nao pode resetar senha de outro admin
      if (targetUser.role === 'admin') {
        return NextResponse.json(
          { error: 'Nao e possivel resetar senha de outro administrador' },
          { status: 403 }
        );
      }

      // Atualizar senha do editor
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      const { error } = await supabaseAdmin
        .from('usuarios')
        .update({ senha_hash: novaSenhaHash })
        .eq('id', targetUserId);

      if (error) {
        console.error('Erro ao resetar senha:', error);
        return NextResponse.json(
          { error: 'Erro ao resetar senha' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'Senha resetada com sucesso' });
    }

    return NextResponse.json(
      { error: 'Parametros invalidos' },
      { status: 400 }
    );

  } catch (err) {
    console.error('Erro:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

