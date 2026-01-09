import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar galerias
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('galerias')
      .select('*')
      .order('is_principal', { ascending: false })
      .order('ordem', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar galerias:', error);
    return NextResponse.json({ error: 'Erro ao buscar galerias' }, { status: 500 });
  }
}

// POST - Criar galeria
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, categoria, descricao, capa_url, video_url, ordem, is_principal } = body;

    if (!nome || typeof nome !== 'string') {
      return NextResponse.json({ error: 'Nome e obrigatorio' }, { status: 400 });
    }

    // Validar limite de 6 galerias principais ao criar
    if (is_principal === true) {
      const { count } = await supabaseAdmin
        .from('galerias')
        .select('*', { count: 'exact', head: true })
        .eq('is_principal', true);

      if (count && count >= 6) {
        return NextResponse.json({ 
          error: 'Limite de 6 galerias na pagina inicial atingido' 
        }, { status: 400 });
      }
    }

    // Gerar slug
    const slug = nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const { data, error } = await supabaseAdmin
      .from('galerias')
      .insert({
        nome: nome.trim().substring(0, 255),
        slug,
        categoria: categoria?.trim().substring(0, 100) || null,
        descricao: descricao || null,
        capa_url: capa_url || null,
        video_url: video_url || null,
        ordem: ordem || 0,
        is_principal: is_principal || false
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar galeria:', error);
    return NextResponse.json({ error: 'Erro ao criar galeria' }, { status: 500 });
  }
}

// PUT - Atualizar galeria
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, nome, categoria, descricao, capa_url, video_url, ordem, is_principal } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    // Validar limite de 6 galerias principais
    if (is_principal === true) {
      // Buscar galeria atual para ver se ja era principal
      const { data: currentGaleria } = await supabaseAdmin
        .from('galerias')
        .select('is_principal')
        .eq('id', id)
        .single();

      // Se nao era principal e quer virar, verificar limite
      if (!currentGaleria?.is_principal) {
        const { count } = await supabaseAdmin
          .from('galerias')
          .select('*', { count: 'exact', head: true })
          .eq('is_principal', true);

        if (count && count >= 6) {
          return NextResponse.json({ 
            error: 'Limite de 6 galerias na pagina inicial atingido' 
          }, { status: 400 });
        }
      }
    }

    const updateData: Record<string, unknown> = {};
    if (nome !== undefined) {
      updateData.nome = nome.trim().substring(0, 255);
      updateData.slug = nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    if (categoria !== undefined) updateData.categoria = categoria?.trim().substring(0, 100) || null;
    if (descricao !== undefined) updateData.descricao = descricao || null;
    if (capa_url !== undefined) updateData.capa_url = capa_url || null;
    if (video_url !== undefined) updateData.video_url = video_url || null;
    if (ordem !== undefined) updateData.ordem = ordem;
    if (is_principal !== undefined) updateData.is_principal = is_principal;

    const { data, error } = await supabaseAdmin
      .from('galerias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar galeria:', error);
    return NextResponse.json({ error: 'Erro ao atualizar galeria' }, { status: 500 });
  }
}

// DELETE - Remover galeria
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

    // Deletar fotos da galeria primeiro (cascade ja faz isso, mas por seguranca)
    await supabaseAdmin
      .from('galeria_fotos')
      .delete()
      .eq('galeria_id', id);

    const { error } = await supabaseAdmin
      .from('galerias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar galeria:', error);
    return NextResponse.json({ error: 'Erro ao deletar galeria' }, { status: 500 });
  }
}
