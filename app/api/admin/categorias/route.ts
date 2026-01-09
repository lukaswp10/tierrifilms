import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar categorias
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('categorias')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}

// POST - Criar categoria
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome } = body;

    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return NextResponse.json({ error: 'Nome e obrigatorio (minimo 2 caracteres)' }, { status: 400 });
    }

    // Buscar maior ordem atual
    const { data: maxOrdem } = await supabaseAdmin
      .from('categorias')
      .select('ordem')
      .order('ordem', { ascending: false })
      .limit(1)
      .single();

    const novaOrdem = (maxOrdem?.ordem || 0) + 1;

    const { data, error } = await supabaseAdmin
      .from('categorias')
      .insert({
        nome: nome.trim().substring(0, 100),
        ordem: novaOrdem
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Ja existe uma categoria com esse nome' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}

// PUT - Atualizar categoria
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nome, ordem } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (nome !== undefined) updateData.nome = nome.trim().substring(0, 100);
    if (ordem !== undefined) updateData.ordem = ordem;

    const { data, error } = await supabaseAdmin
      .from('categorias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Ja existe uma categoria com esse nome' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 });
  }
}

// DELETE - Remover categoria
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

    // Verificar se ha galerias usando esta categoria
    const { data: categoria } = await supabaseAdmin
      .from('categorias')
      .select('nome')
      .eq('id', id)
      .single();

    if (categoria) {
      const { count } = await supabaseAdmin
        .from('galerias')
        .select('*', { count: 'exact', head: true })
        .eq('categoria', categoria.nome);

      if (count && count > 0) {
        return NextResponse.json({ 
          error: `Nao e possivel excluir. ${count} galeria(s) usam esta categoria.` 
        }, { status: 400 });
      }
    }

    const { error } = await supabaseAdmin
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return NextResponse.json({ error: 'Erro ao deletar categoria' }, { status: 500 });
  }
}

