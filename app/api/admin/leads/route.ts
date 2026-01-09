import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Listar leads com filtros e metricas
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const busca = searchParams.get('busca');
    const tipo_servico = searchParams.get('tipo_servico');
    const prioridade = searchParams.get('prioridade');
    const origem = searchParams.get('origem');
    const data_evento_inicio = searchParams.get('data_evento_inicio');
    const data_evento_fim = searchParams.get('data_evento_fim');
    const limite = parseInt(searchParams.get('limite') || '100');

    let query = supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limite);

    // Filtrar por status
    if (status && status !== 'todos') {
      query = query.eq('status', status);
    }

    // Buscar por nome, email ou empresa
    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,email.ilike.%${busca}%,empresa.ilike.%${busca}%`);
    }

    // Filtros avancados
    if (tipo_servico && tipo_servico !== 'todos') {
      query = query.eq('tipo_servico', tipo_servico);
    }

    if (prioridade && prioridade !== 'todos') {
      query = query.eq('prioridade', prioridade);
    }

    if (origem && origem !== 'todos') {
      query = query.eq('origem', origem);
    }

    if (data_evento_inicio) {
      query = query.gte('data_evento', data_evento_inicio);
    }

    if (data_evento_fim) {
      query = query.lte('data_evento', data_evento_fim);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Buscar todos os leads para calcular metricas
    const { data: allLeads } = await supabaseAdmin
      .from('leads')
      .select('status, orcamento_estimado, created_at, proximo_contato');

    // Calcular metricas
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const leadsEsteMes = allLeads?.filter(l => new Date(l.created_at) >= startOfMonth).length || 0;
    const totalLeads = allLeads?.length || 0;
    const leadsFechados = allLeads?.filter(l => l.status === 'fechado').length || 0;
    const taxaConversao = totalLeads > 0 ? Math.round((leadsFechados / totalLeads) * 100) : 0;
    
    // Pipeline = soma dos orcamentos de leads em negociacao/proposta
    const valorPipeline = allLeads
      ?.filter(l => ['proposta', 'negociando'].includes(l.status))
      .reduce((acc, l) => acc + (Number(l.orcamento_estimado) || 0), 0) || 0;

    // Follow-ups pendentes (proximo_contato no passado ou hoje)
    const hoje = new Date().toISOString().split('T')[0];
    const followUpsPendentes = allLeads?.filter(l => 
      l.proximo_contato && l.proximo_contato.split('T')[0] <= hoje && 
      !['fechado', 'perdido'].includes(l.status)
    ).length || 0;

    // Contar por status
    const statusCounts = {
      todos: allLeads?.length || 0,
      novo: allLeads?.filter(l => l.status === 'novo').length || 0,
      contatado: allLeads?.filter(l => l.status === 'contatado').length || 0,
      proposta: allLeads?.filter(l => l.status === 'proposta').length || 0,
      negociando: allLeads?.filter(l => l.status === 'negociando').length || 0,
      fechado: allLeads?.filter(l => l.status === 'fechado').length || 0,
      perdido: allLeads?.filter(l => l.status === 'perdido').length || 0,
    };

    // Leads por mes (ultimos 6 meses)
    const leadsPorMes: { mes: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const mesNome = date.toLocaleDateString('pt-BR', { month: 'short' });
      const total = allLeads?.filter(l => {
        const d = new Date(l.created_at);
        return d >= date && d < nextDate;
      }).length || 0;
      leadsPorMes.push({ mes: mesNome.replace('.', ''), total });
    }

    return NextResponse.json({ 
      leads: data || [], 
      counts: statusCounts,
      metricas: {
        leadsEsteMes,
        taxaConversao,
        valorPipeline,
        followUpsPendentes,
        leadsPorMes
      }
    });
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
  }
}

// POST - Criar lead manualmente
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nome, email, telefone, empresa, projeto, tipo_servico, origem, prioridade, data_evento, local_evento, orcamento_estimado } = body;

    // Validar campos obrigatorios
    if (!nome || !email) {
      return NextResponse.json({ error: 'Nome e email sao obrigatorios' }, { status: 400 });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalido' }, { status: 400 });
    }

    const leadData: Record<string, unknown> = {
      nome: nome.substring(0, 200),
      email: email.toLowerCase().substring(0, 200),
      telefone: telefone?.substring(0, 20) || null,
      empresa: empresa?.substring(0, 200) || null,
      projeto: projeto?.substring(0, 2000) || 'Lead criado manualmente',
      status: 'novo',
      tipo_servico: tipo_servico || null,
      origem: origem || 'outro',
      prioridade: prioridade || 'media',
      data_evento: data_evento || null,
      local_evento: local_evento?.substring(0, 200) || null,
      orcamento_estimado: orcamento_estimado ? Number(orcamento_estimado) : null,
    };

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
  }
}

// PUT - Atualizar lead (todos os campos)
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    // Campos permitidos para atualizacao
    const allowedFields = [
      'status', 'notas', 'tipo_servico', 'data_evento', 'local_evento',
      'orcamento_estimado', 'origem', 'prioridade', 'proximo_contato'
    ];

    // Validar status
    if (fields.status !== undefined) {
      const validStatus = ['novo', 'contatado', 'proposta', 'negociando', 'fechado', 'perdido'];
      if (!validStatus.includes(fields.status)) {
        return NextResponse.json({ error: 'Status invalido' }, { status: 400 });
      }
    }

    // Copiar campos permitidos
    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        if (field === 'notas') {
          updateData[field] = fields[field]?.substring(0, 2000) || null;
        } else if (field === 'orcamento_estimado') {
          updateData[field] = fields[field] ? Number(fields[field]) : null;
        } else {
          updateData[field] = fields[field] || null;
        }
      }
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
