import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

