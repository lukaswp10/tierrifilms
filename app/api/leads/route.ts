import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Salvar lead do formulario de contato (publico)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, empresa, projeto } = body;

    // Validacoes
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nome e obrigatorio (minimo 2 caracteres)' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email e obrigatorio' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalido' },
        { status: 400 }
      );
    }

    if (!projeto || typeof projeto !== 'string' || projeto.trim().length < 10) {
      return NextResponse.json(
        { error: 'Descricao do projeto e obrigatoria (minimo 10 caracteres)' },
        { status: 400 }
      );
    }

    // Inserir lead no banco
    const { data, error } = await supabase
      .from('leads')
      .insert({
        nome: nome.trim().substring(0, 100),
        email: email.trim().toLowerCase().substring(0, 100),
        telefone: telefone?.trim().substring(0, 20) || null,
        empresa: empresa?.trim().substring(0, 100) || null,
        projeto: projeto.trim().substring(0, 2000),
        status: 'novo'
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar lead:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar contato' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contato salvo com sucesso',
      id: data.id 
    });

  } catch (err) {
    console.error('Erro:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

