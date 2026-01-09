-- =============================================
-- TIERRIFILMS - SCHEMA DO BANCO DE DADOS
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela de usuarios (admin do sistema)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configuracoes do site
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave VARCHAR(255) UNIQUE NOT NULL,
  valor TEXT,
  tipo VARCHAR(50) DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagem', 'video'))
);

-- Tabela de galerias
CREATE TABLE IF NOT EXISTS galerias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  categoria VARCHAR(100),
  descricao TEXT,
  capa_url TEXT,
  video_url TEXT,
  ordem INTEGER DEFAULT 0,
  is_principal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fotos das galerias
CREATE TABLE IF NOT EXISTS galeria_fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  galeria_id UUID REFERENCES galerias(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  legenda VARCHAR(255),
  ordem INTEGER DEFAULT 0
);

-- Tabela da equipe (CREW)
CREATE TABLE IF NOT EXISTS equipe (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cargo VARCHAR(255),
  foto_url TEXT,
  ordem INTEGER DEFAULT 0
);

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Usuario admin inicial (senha: admin123)
-- IMPORTANTE: Troque a senha depois!
INSERT INTO usuarios (email, senha_hash, nome, role) VALUES
('admin@tierrifilms.com.br', '$2a$10$rQnM1kJxP5VhZLzCvNxZXOqEqJHvYF5qzCvQhYq5xGqLvXzNpZJXK', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Configuracoes iniciais do site
INSERT INTO configuracoes (chave, valor, tipo) VALUES
('logo_tipo', 'texto', 'texto'),
('logo_texto', 'T\\F', 'texto'),
('logo_imagem', '', 'imagem'),
('titulo_hero', 'TIERRIFILMS', 'texto'),
('subtitulo_hero', 'PRODUCAO AUDIOVISUAL', 'texto'),
('video_fundo', '', 'video'),
('slogan_footer', 'ETERNIZE O REAL', 'texto'),
('email_contato', 'contato@tierrifilms.com.br', 'texto'),
('whatsapp', '5511999999999', 'texto'),
('instagram', 'https://instagram.com/tierrifilms', 'texto'),
('youtube', 'https://youtube.com/@tierrifilms', 'texto'),
('facebook', 'https://facebook.com/tierrifilms', 'texto'),
('endereco', 'SAO PAULO, SP', 'texto')
ON CONFLICT (chave) DO NOTHING;

-- 6 Galerias principais (fixas)
INSERT INTO galerias (nome, slug, categoria, descricao, is_principal, ordem, capa_url) VALUES
('Casamento Ana & Pedro', 'casamento-ana-pedro', 'Casamento', 'Um dia magico capturado em cada detalhe', true, 1, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800'),
('Evento Corporativo XYZ', 'evento-corporativo-xyz', 'Corporativo', 'Cobertura completa do evento anual', true, 2, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800'),
('Casamento Julia & Marcos', 'casamento-julia-marcos', 'Casamento', 'Amor eternizado em imagens', true, 3, 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800'),
('Festa de Formatura', 'festa-formatura', 'Evento', 'Celebracao de uma conquista', true, 4, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800'),
('Aniversario de 15 Anos', 'aniversario-15-anos', 'Evento', 'Uma noite inesquecivel', true, 5, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800'),
('Casamento Praia', 'casamento-praia', 'Casamento', 'Pe na areia, amor no ar', true, 6, 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=800')
ON CONFLICT (slug) DO NOTHING;

-- Equipe inicial
INSERT INTO equipe (nome, cargo, ordem, foto_url) VALUES
('Tierri', 'Diretor', 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400'),
('Maria', 'Editora', 2, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400'),
('Carlos', 'Cinegrafista', 3, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400')
ON CONFLICT DO NOTHING;

-- =============================================
-- POLITICAS DE SEGURANCA (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipe ENABLE ROW LEVEL SECURITY;

-- Politicas de leitura publica (para o site)
CREATE POLICY "Leitura publica configuracoes" ON configuracoes FOR SELECT USING (true);
CREATE POLICY "Leitura publica galerias" ON galerias FOR SELECT USING (true);
CREATE POLICY "Leitura publica galeria_fotos" ON galeria_fotos FOR SELECT USING (true);
CREATE POLICY "Leitura publica equipe" ON equipe FOR SELECT USING (true);

-- Politicas de escrita (apenas autenticados)
CREATE POLICY "Escrita autenticada configuracoes" ON configuracoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita autenticada galerias" ON galerias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita autenticada galeria_fotos" ON galeria_fotos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita autenticada equipe" ON equipe FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Escrita autenticada usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- PRONTO! Banco configurado com sucesso.
-- =============================================

