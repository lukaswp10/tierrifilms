import { cache } from 'react';
import { db, consulta } from './db';
import type { Equipe, Galeria, GaleriaFoto, Parceiro } from './tipos';

// Leituras do site público (componentes de servidor). Se o banco falhar,
// devolvem vazio: a página sai com os textos padrão em vez de quebrar.

// cache(): titulo da pagina e layout leem os textos uma vez so por requisicao.
export const getTodasConfiguracoes = cache(async (): Promise<Record<string, string>> => {
  const { data } = await db.from<{ chave: string; valor: string | null }>('configuracoes').select('chave, valor');
  return Object.fromEntries((data ?? []).map((c) => [c.chave, c.valor ?? '']));
});

export async function getGaleriasPrincipais(limite = 6): Promise<Galeria[]> {
  const { data } = await db.from<Galeria>('galerias').select('*').eq('is_principal', true).order('ordem').limit(limite);
  return data ?? [];
}

export async function getTodasGalerias(): Promise<Galeria[]> {
  try {
    return await consulta<Galeria>(
      `SELECT g.*,
              COALESCE(
                (SELECT json_agg(json_build_object('url', f.foto_url) ORDER BY f.ordem)
                   FROM galeria_fotos f WHERE f.galeria_id = g.id),
                '[]'::json
              ) AS fotos
         FROM galerias g
        ORDER BY g.ordem ASC`,
    );
  } catch (e) {
    console.error('Erro ao buscar galerias:', e);
    return [];
  }
}

export async function getGaleriaPorSlug(slug: string): Promise<Galeria | null> {
  const { data } = await db.from<Galeria>('galerias').select('*').eq('slug', slug).single();
  return data;
}

export async function getFotosDaGaleria(galeriaId: string): Promise<GaleriaFoto[]> {
  const { data } = await db.from<GaleriaFoto>('galeria_fotos').select('*').eq('galeria_id', galeriaId).order('ordem');
  return data ?? [];
}

export async function getEquipe(): Promise<Equipe[]> {
  const { data } = await db.from<Equipe>('equipe').select('*').order('ordem');
  return data ?? [];
}

export async function getParceiros(): Promise<Parceiro[]> {
  const { data } = await db.from<Parceiro>('parceiros').select('*').order('ordem');
  return data ?? [];
}
