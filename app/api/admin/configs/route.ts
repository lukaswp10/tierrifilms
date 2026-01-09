import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Buscar todas as configuracoes
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('configuracoes')
      .select('chave, valor');

    if (error) throw error;

    const configs = (data || []).reduce((acc, item) => {
      acc[item.chave] = item.valor || '';
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(configs);
  } catch (error) {
    console.error('Erro ao buscar configs:', error);
    return NextResponse.json({ error: 'Erro ao buscar configuracoes' }, { status: 500 });
  }
}

// POST - Salvar configuracoes
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const configs = await request.json();

    if (typeof configs !== 'object' || configs === null) {
      return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
    }

    // Atualizar cada configuracao
    for (const [chave, valor] of Object.entries(configs)) {
      // Sanitizar valor (remover scripts maliciosos basicos)
      const valorSanitizado = sanitizeValue(String(valor));

      const { error } = await supabaseAdmin
        .from('configuracoes')
        .upsert({ chave, valor: valorSanitizado }, { onConflict: 'chave' });

      if (error) {
        console.error(`Erro ao salvar config ${chave}:`, error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar configs:', error);
    return NextResponse.json({ error: 'Erro ao salvar configuracoes' }, { status: 500 });
  }
}

// Sanitizacao basica de valores
function sanitizeValue(value: string): string {
  // Remover tags script
  let sanitized = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remover event handlers
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  // Remover javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  return sanitized.trim();
}
