import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar templates
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('whatsapp_templates')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ templates: data || [] });
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    return NextResponse.json({ error: 'Erro ao buscar templates' }, { status: 500 });
  }
}

// POST - Criar novo template
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, mensagem } = body;

    if (!nome || !mensagem) {
      return NextResponse.json({ error: 'Nome e mensagem sao obrigatorios' }, { status: 400 });
    }

    // Pegar a maior ordem atual
    const { data: maxOrdem } = await supabaseAdmin
      .from('whatsapp_templates')
      .select('ordem')
      .order('ordem', { ascending: false })
      .limit(1)
      .single();

    const { data, error } = await supabaseAdmin
      .from('whatsapp_templates')
      .insert([{
        nome: nome.substring(0, 100),
        mensagem: mensagem.substring(0, 2000),
        ordem: (maxOrdem?.ordem || 0) + 1,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar template:', error);
    return NextResponse.json({ error: 'Erro ao criar template' }, { status: 500 });
  }
}

// PUT - Atualizar template
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nome, mensagem } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (nome !== undefined) updateData.nome = nome.substring(0, 100);
    if (mensagem !== undefined) updateData.mensagem = mensagem.substring(0, 2000);

    const { data, error } = await supabaseAdmin
      .from('whatsapp_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    return NextResponse.json({ error: 'Erro ao atualizar template' }, { status: 500 });
  }
}

// DELETE - Remover template
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('whatsapp_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar template:', error);
    return NextResponse.json({ error: 'Erro ao deletar template' }, { status: 500 });
  }
}

