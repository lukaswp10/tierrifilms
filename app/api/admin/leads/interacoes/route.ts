import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar interacoes de um lead
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const lead_id = searchParams.get('lead_id');

    if (!lead_id) {
      return NextResponse.json({ error: 'lead_id e obrigatorio' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('lead_interacoes')
      .select('*')
      .eq('lead_id', lead_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ interacoes: data || [] });
  } catch (error) {
    console.error('Erro ao buscar interacoes:', error);
    return NextResponse.json({ error: 'Erro ao buscar interacoes' }, { status: 500 });
  }
}

// POST - Criar nova interacao
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lead_id, tipo, descricao } = body;

    if (!lead_id || !tipo) {
      return NextResponse.json({ error: 'lead_id e tipo sao obrigatorios' }, { status: 400 });
    }

    const validTipos = ['whatsapp', 'email', 'ligacao', 'reuniao', 'nota'];
    if (!validTipos.includes(tipo)) {
      return NextResponse.json({ error: 'Tipo invalido' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('lead_interacoes')
      .insert([{
        lead_id,
        tipo,
        descricao: descricao?.substring(0, 1000) || null,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar interacao:', error);
    return NextResponse.json({ error: 'Erro ao criar interacao' }, { status: 500 });
  }
}

// DELETE - Remover interacao
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
      .from('lead_interacoes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar interacao:', error);
    return NextResponse.json({ error: 'Erro ao deletar interacao' }, { status: 500 });
  }
}

