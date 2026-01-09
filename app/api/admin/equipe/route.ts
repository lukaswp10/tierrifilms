import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar equipe
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('equipe')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    return NextResponse.json({ error: 'Erro ao buscar equipe' }, { status: 500 });
  }
}

// POST - Criar membro
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, cargo, foto_url, ordem } = body;

    if (!nome || typeof nome !== 'string') {
      return NextResponse.json({ error: 'Nome e obrigatorio' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('equipe')
      .insert({
        nome: nome.trim().substring(0, 255),
        cargo: cargo?.trim().substring(0, 255) || null,
        foto_url: foto_url || null,
        ordem: ordem || 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    return NextResponse.json({ error: 'Erro ao criar membro' }, { status: 500 });
  }
}

// PUT - Atualizar membro
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nome, cargo, foto_url, ordem } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (nome !== undefined) updateData.nome = nome.trim().substring(0, 255);
    if (cargo !== undefined) updateData.cargo = cargo?.trim().substring(0, 255) || null;
    if (foto_url !== undefined) updateData.foto_url = foto_url || null;
    if (ordem !== undefined) updateData.ordem = ordem;

    const { data, error } = await supabaseAdmin
      .from('equipe')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar membro' }, { status: 500 });
  }
}

// DELETE - Remover membro
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
      .from('equipe')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    return NextResponse.json({ error: 'Erro ao deletar membro' }, { status: 500 });
  }
}
