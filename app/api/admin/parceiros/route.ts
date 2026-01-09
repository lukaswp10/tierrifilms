import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar parceiros
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('parceiros')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar parceiros:', error);
    return NextResponse.json({ error: 'Erro ao buscar parceiros' }, { status: 500 });
  }
}

// POST - Criar parceiro
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, logo_url, ordem } = body;

    if (!nome || typeof nome !== 'string') {
      return NextResponse.json({ error: 'Nome e obrigatorio' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('parceiros')
      .insert({
        nome: nome.trim().substring(0, 255),
        logo_url: logo_url || null,
        ordem: ordem || 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao criar parceiro' }, { status: 500 });
  }
}

// PUT - Atualizar parceiro
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nome, logo_url, ordem } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (nome) updateData.nome = nome.trim().substring(0, 255);
    if (logo_url !== undefined) updateData.logo_url = logo_url || null;
    if (ordem !== undefined) updateData.ordem = ordem;

    const { data, error } = await supabaseAdmin
      .from('parceiros')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar parceiro' }, { status: 500 });
  }
}

// DELETE - Remover parceiro
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
      .from('parceiros')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar parceiro:', error);
    return NextResponse.json({ error: 'Erro ao deletar parceiro' }, { status: 500 });
  }
}
