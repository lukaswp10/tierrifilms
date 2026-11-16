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

export interface Categoria {
  id: string;
  nome: string;
  ordem: number;
  created_at: string;
}

export interface Galeria {
  id: string;
  nome: string;
  slug: string;
  categoria: string;
  descricao?: string;
  capa_url?: string;
  capa_tipo?: 'imagem' | 'video';
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
  tipo?: 'foto' | 'video';
}

// Alias para compatibilidade - midia pode ser foto ou video
export type GaleriaMidia = GaleriaFoto;

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

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  projeto: string;
  status: 'novo' | 'contatado' | 'proposta' | 'negociando' | 'fechado' | 'perdido';
  notas?: string;
  // Campos do CRM profissional
  tipo_servico?: 'casamento' | 'evento' | 'corporativo' | 'clip' | 'outro';
  data_evento?: string;
  local_evento?: string;
  orcamento_estimado?: number;
  origem?: 'site' | 'instagram' | 'google' | 'indicacao' | 'outro';
  prioridade?: 'alta' | 'media' | 'baixa';
  proximo_contato?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadInteracao {
  id: string;
  lead_id: string;
  tipo: 'whatsapp' | 'email' | 'ligacao' | 'reuniao' | 'nota';
  descricao?: string;
  created_at: string;
}
