import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar fotos de uma galeria
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const galeriaId = searchParams.get('galeria_id');

  if (!galeriaId) {
    return NextResponse.json({ error: 'galeria_id e obrigatorio' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('galeria_fotos')
      .select('*')
      .eq('galeria_id', galeriaId)
      .order('ordem', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    return NextResponse.json({ error: 'Erro ao buscar fotos' }, { status: 500 });
  }
}

// POST - Adicionar foto ou video
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { galeria_id, foto_url, legenda, ordem, tipo } = body;

    if (!galeria_id || !foto_url) {
      return NextResponse.json({ error: 'galeria_id e foto_url sao obrigatorios' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('galeria_fotos')
      .insert({
        galeria_id,
        foto_url,
        legenda: legenda?.substring(0, 255) || null,
        ordem: ordem || 0,
        tipo: tipo || 'foto'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao adicionar midia:', error);
    return NextResponse.json({ error: 'Erro ao adicionar midia' }, { status: 500 });
  }
}

// PUT - Atualizar foto
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, legenda, ordem } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (legenda !== undefined) updateData.legenda = legenda?.substring(0, 255) || null;
    if (ordem !== undefined) updateData.ordem = ordem;

    const { data, error } = await supabaseAdmin
      .from('galeria_fotos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar foto' }, { status: 500 });
  }
}

// DELETE - Remover foto
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
      .from('galeria_fotos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    return NextResponse.json({ error: 'Erro ao deletar foto' }, { status: 500 });
  }
}
