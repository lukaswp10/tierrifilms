-- =============================================
-- TIERRIFILMS - banco (Neon Postgres)
-- Aplicar com: node --env-file=.env.local scripts/aplicar-schema.mjs
-- Pode rodar de novo: so cria o que falta.
-- =============================================

-- Usuarios do painel (/admin). Senha em bcrypt.
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  nome TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Textos, cores e links do site (chave -> valor)
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT,
  tipo TEXT NOT NULL DEFAULT 'texto'
);

-- Categorias das galerias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Galerias (CASES)
CREATE TABLE IF NOT EXISTS galerias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria TEXT,
  descricao TEXT,
  capa_url TEXT,
  capa_tipo TEXT DEFAULT 'imagem',
  video_url TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  is_principal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fotos e videos de cada galeria
CREATE TABLE IF NOT EXISTS galeria_fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  galeria_id UUID NOT NULL REFERENCES galerias(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  legenda TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  tipo TEXT DEFAULT 'foto',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS galeria_fotos_galeria_idx ON galeria_fotos (galeria_id, ordem);

-- Equipe (CREW)
CREATE TABLE IF NOT EXISTS equipe (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  foto_url TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Parceiros / clientes
CREATE TABLE IF NOT EXISTS parceiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  logo_url TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads (formulario de contato + CRM do painel)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  empresa TEXT,
  projeto TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo'
    CHECK (status IN ('novo', 'contatado', 'proposta', 'negociando', 'fechado', 'perdido')),
  notas TEXT,
  tipo_servico TEXT,
  data_evento DATE,
  local_evento TEXT,
  orcamento_estimado NUMERIC(12, 2),
  origem TEXT DEFAULT 'site',
  prioridade TEXT DEFAULT 'media',
  proximo_contato DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);

-- Historico de contato com cada lead
CREATE TABLE IF NOT EXISTS lead_interacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS lead_interacoes_lead_idx ON lead_interacoes (lead_id, created_at DESC);

-- Mensagens prontas de WhatsApp do CRM
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
