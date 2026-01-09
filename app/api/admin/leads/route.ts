import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar leads com filtros
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const busca = searchParams.get('busca');
    const limite = parseInt(searchParams.get('limite') || '50');

    let query = supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limite);

    // Filtrar por status
    if (status && status !== 'todos') {
      query = query.eq('status', status);
    }

    // Buscar por nome ou email
    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,email.ilike.%${busca}%,empresa.ilike.%${busca}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Contar por status
    const { data: counts } = await supabaseAdmin
      .from('leads')
      .select('status');

    const statusCounts = {
      todos: counts?.length || 0,
      novo: counts?.filter(l => l.status === 'novo').length || 0,
      contatado: counts?.filter(l => l.status === 'contatado').length || 0,
      fechado: counts?.filter(l => l.status === 'fechado').length || 0,
      perdido: counts?.filter(l => l.status === 'perdido').length || 0,
    };

    return NextResponse.json({ leads: data || [], counts: statusCounts });
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
  }
}

// PUT - Atualizar lead (status, notas)
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, notas } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (status !== undefined) {
      const validStatus = ['novo', 'contatado', 'fechado', 'perdido'];
      if (!validStatus.includes(status)) {
        return NextResponse.json({ error: 'Status invalido' }, { status: 400 });
      }
      updateData.status = status;
    }

    if (notas !== undefined) {
      updateData.notas = notas?.substring(0, 2000) || null;
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
  }
}

// DELETE - Remover lead
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
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar lead:', error);
    return NextResponse.json({ error: 'Erro ao deletar lead' }, { status: 500 });
  }
}

