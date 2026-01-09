import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  tipo: 'texto' | 'imagem' | 'video';
}

export interface Galeria {
  id: string;
  nome: string;
  slug: string;
  categoria: string;
  descricao?: string;
  capa_url?: string;
  video_url?: string;
  ordem: number;
  is_principal: boolean;
  created_at: string;
  fotos?: { url: string }[];
}

export interface GaleriaFoto {
  id: string;
  galeria_id: string;
  foto_url: string;
  legenda?: string;
  ordem: number;
}

export interface Equipe {
  id: string;
  nome: string;
  cargo: string;
  foto_url?: string;
  ordem: number;
}

export interface Parceiro {
  id: string;
  nome: string;
  logo_url?: string;
  ordem: number;
}

// Funcoes de busca - Configuracoes
export async function getConfiguracao(chave: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('valor')
    .eq('chave', chave)
    .single();
  
  if (error) return null;
  return data?.valor || null;
}

export async function getTodasConfiguracoes(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('chave, valor');
  
  if (error || !data) return {};
  
  return data.reduce((acc, item) => {
    acc[item.chave] = item.valor;
    return acc;
  }, {} as Record<string, string>);
}

// Funcoes de busca - Galerias
export async function getGaleriasPrincipais(): Promise<Galeria[]> {
  const { data, error } = await supabase
    .from('galerias')
    .select('*')
    .eq('is_principal', true)
    .order('ordem', { ascending: true });
  
  if (error) return [];
  return data || [];
}

export async function getGaleriasExtras(): Promise<Galeria[]> {
  const { data, error } = await supabase
    .from('galerias')
    .select('*')
    .eq('is_principal', false)
    .order('ordem', { ascending: true });
  
  if (error) return [];
  return data || [];
}

export async function getTodasGalerias(): Promise<Galeria[]> {
  const { data, error } = await supabase
    .from('galerias')
    .select('*, galeria_fotos(foto_url)')
    .order('ordem', { ascending: true });
  
  if (error) return [];
  
  // Mapear fotos para o formato esperado
  return (data || []).map(g => ({
    ...g,
    fotos: g.galeria_fotos?.map((f: { foto_url: string }) => ({ url: f.foto_url })) || []
  }));
}

export async function getGaleriaPorSlug(slug: string): Promise<Galeria | null> {
  const { data, error } = await supabase
    .from('galerias')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) return null;
  return data;
}

export async function getFotosDaGaleria(galeriaId: string): Promise<GaleriaFoto[]> {
  const { data, error } = await supabase
    .from('galeria_fotos')
    .select('*')
    .eq('galeria_id', galeriaId)
    .order('ordem', { ascending: true });
  
  if (error) return [];
  return data || [];
}

// Funcoes de busca - Equipe
export async function getEquipe(): Promise<Equipe[]> {
  const { data, error } = await supabase
    .from('equipe')
    .select('*')
    .order('ordem', { ascending: true });
  
  if (error) return [];
  return data || [];
}
