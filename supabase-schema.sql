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

-- Tabela de parceiros/clientes
CREATE TABLE IF NOT EXISTS parceiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  logo_url TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
-- Logo
('logo_tipo', 'texto', 'texto'),
('logo_texto', 'T\\F', 'texto'),
('logo_imagem_url', '', 'imagem'),
-- Hero
('hero_linha1', 'ESPECIALISTAS', 'texto'),
('hero_linha2', 'EM CAPTAR', 'texto'),
('hero_linha3', 'MOMENTOS', 'texto'),
('hero_linha4', 'REAIS', 'texto'),
('video_fundo', '', 'video'),
-- About
('about_paragrafo1', 'Momentos reais nos conectam de formas que nenhuma tecnologia pode replicar. Eles nos lembram do que e ser humano, do calor de um abraco e do som do riso, da emocao dos encontros. Eles nos reconectam com a nossa essencia, com o que realmente importa. Te convidamos a reconectar com o autentico, a sentir e viver verdadeiramente.', 'texto'),
('about_destaque', 'TIERRIFILMS, Eternize o Real.', 'texto'),
('about_paragrafo2', 'Com anos de experiencia no mercado audiovisual, formamos uma equipe de especialistas e criamos em colaboracao com os melhores profissionais. Nos tornamos referencia em captar momentos reais, encontrando a combinacao perfeita entre os movimentos de camera, a dinamica e linguagem de uma nova era da comunicacao.', 'texto'),
-- Showreel (NOVO)
('showreel_titulo', 'SHOWREEL', 'texto'),
('showreel_subtitulo', 'TIERRIFILMS', 'texto'),
('showreel_texto', 'Eternize o Real,', 'texto'),
('showreel_local', 'SP (BR)', 'texto'),
('showreel_imagem', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop', 'imagem'),
('showreel_video_url', '', 'video'),
-- Marquee (NOVO)
('marquee_texto1', 'PRODUCAO AUDIOVISUAL PARA CASAMENTOS E EVENTOS', 'texto'),
('marquee_texto2', 'O OLHAR CINEMATOGRAFICO QUE ETERNIZA SEUS MELHORES MOMENTOS', 'texto'),
-- Diferenciais/Servicos
('servicos_titulo', 'PORQUE A TIERRIFILMS', 'texto'),
('diferencial1_titulo', 'EXCELENCIA NO PROCESSO', 'texto'),
('diferencial1_subtitulo', 'O Parceiro que Resolve.', 'texto'),
('diferencial1_descricao', 'Nos entregamos excelencia no resultado e na jornada. Nossa especializacao nos permite operar com velocidade e eficiencia inigualaveis, refletidas em nosso altissimo indice de aprovacao de primeira. Para nossos clientes, isso significa menos retrabalho e a tranquilidade de ter um parceiro que resolve.', 'texto'),
('diferencial2_titulo', 'ESPECIALIZACAO OBSESSIVA', 'texto'),
('diferencial2_subtitulo', 'O Especialista em Momentos.', 'texto'),
('diferencial2_descricao', 'Enquanto outros fazem de tudo, nos so fazemos isso. Somos especialistas com dedicacao obsessiva a um unico campo: a energia de momentos reais, casamentos e eventos que merecem ser eternizados com qualidade cinematografica.', 'texto'),
('diferencial3_titulo', 'QUALIDADE CINEMATOGRAFICA', 'texto'),
('diferencial3_subtitulo', 'O Padrao TIERRIFILMS.', 'texto'),
('diferencial3_descricao', 'Nos acreditamos que a emocao nasce da qualidade, nao apesar dela. Nossa obsessao pela excelencia visual, a qualidade cinematografica e a narrativa que arrepia, e nossa principal ferramenta para entregar resultados que superam expectativas.', 'texto'),
-- Numeros/Stats
('stat1_valor', '150', 'texto'),
('stat1_label', 'PRODUCOES', 'texto'),
('stat2_valor', '200', 'texto'),
('stat2_label', 'VIDEOS PRODUZIDOS', 'texto'),
('stat3_valor', '5', 'texto'),
('stat3_label', 'ANOS DE EXPERIENCIA', 'texto'),
('stat4_valor', '50', 'texto'),
('stat4_label', 'EVENTOS POR ANO', 'texto'),
-- Contato
('contato_titulo', 'BORA FALAR!', 'texto'),
('whatsapp', '5511999999999', 'texto'),
-- Rodape
('slogan_footer', 'ETERNIZE O REAL', 'texto'),
('endereco', 'SAO PAULO, SP', 'texto'),
('email_contato', 'contato@tierrifilms.com.br', 'texto'),
('instagram', 'https://instagram.com/tierrifilms', 'texto'),
('youtube', 'https://youtube.com/@tierrifilms', 'texto'),
('facebook', 'https://facebook.com/tierrifilms', 'texto'),
-- Navbar (NOVO)
('nav_link1_label', 'INICIO', 'texto'),
('nav_link1_href', '#', 'texto'),
('nav_link2_label', 'SOBRE', 'texto'),
('nav_link2_href', '#sobre', 'texto'),
('nav_link3_label', 'CASES', 'texto'),
('nav_link3_href', '#portfolio', 'texto'),
('nav_link4_label', 'SERVICOS', 'texto'),
('nav_link4_href', '#servicos', 'texto'),
('nav_link5_label', 'CONTATO', 'texto'),
('nav_link5_href', '#contato', 'texto')
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

-- Parceiros/Clientes iniciais
INSERT INTO parceiros (nome, ordem) VALUES
('BUFFET TORRES', 1),
('CASA DE FESTAS SP', 2),
('DECORART', 3),
('FLOWERS & CO', 4),
('VILLA EVENTOS', 5),
('DOCES FINOS', 6),
('DJ MARCOS', 7),
('BUFFET GOURMET', 8),
('ASSESSORIA PRIME', 9),
('CERIMONIAL LUXO', 10),
('FOTO STUDIO', 11),
('MAKEUP ARTIST', 12),
('ESPACOS VIP', 13),
('CONVITES FINOS', 14),
('BOLOS & CIA', 15)
ON CONFLICT DO NOTHING;

-- =============================================
-- POLITICAS DE SEGURANCA (RLS) - CORRIGIDAS
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE galerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE parceiros ENABLE ROW LEVEL SECURITY;

-- Remover politicas antigas (se existirem)
DROP POLICY IF EXISTS "Leitura publica configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "Leitura publica galerias" ON galerias;
DROP POLICY IF EXISTS "Leitura publica galeria_fotos" ON galeria_fotos;
DROP POLICY IF EXISTS "Leitura publica equipe" ON equipe;
DROP POLICY IF EXISTS "Escrita autenticada configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "Escrita autenticada galerias" ON galerias;
DROP POLICY IF EXISTS "Escrita autenticada galeria_fotos" ON galeria_fotos;
DROP POLICY IF EXISTS "Escrita autenticada equipe" ON equipe;
DROP POLICY IF EXISTS "Escrita autenticada usuarios" ON usuarios;

-- POLITICAS DE LEITURA PUBLICA (para o site publico)
-- Qualquer pessoa pode LER dados publicos
CREATE POLICY "select_configuracoes" ON configuracoes FOR SELECT USING (true);
CREATE POLICY "select_galerias" ON galerias FOR SELECT USING (true);
CREATE POLICY "select_galeria_fotos" ON galeria_fotos FOR SELECT USING (true);
CREATE POLICY "select_equipe" ON equipe FOR SELECT USING (true);
CREATE POLICY "select_parceiros" ON parceiros FOR SELECT USING (true);

-- POLITICAS DE ESCRITA - APENAS SERVICE ROLE
-- A anon key NAO pode inserir/atualizar/deletar
-- Apenas o service_role (usado nas API routes) pode escrever

-- Configuracoes: somente service_role pode escrever
CREATE POLICY "insert_configuracoes" ON configuracoes FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "update_configuracoes" ON configuracoes FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "delete_configuracoes" ON configuracoes FOR DELETE 
  USING (auth.role() = 'service_role');

-- Galerias: somente service_role pode escrever
CREATE POLICY "insert_galerias" ON galerias FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "update_galerias" ON galerias FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "delete_galerias" ON galerias FOR DELETE 
  USING (auth.role() = 'service_role');

-- Fotos das galerias: somente service_role pode escrever
CREATE POLICY "insert_galeria_fotos" ON galeria_fotos FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "update_galeria_fotos" ON galeria_fotos FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "delete_galeria_fotos" ON galeria_fotos FOR DELETE 
  USING (auth.role() = 'service_role');

-- Equipe: somente service_role pode escrever
CREATE POLICY "insert_equipe" ON equipe FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "update_equipe" ON equipe FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "delete_equipe" ON equipe FOR DELETE 
  USING (auth.role() = 'service_role');

-- Parceiros: somente service_role pode escrever
CREATE POLICY "insert_parceiros" ON parceiros FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "update_parceiros" ON parceiros FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "delete_parceiros" ON parceiros FOR DELETE 
  USING (auth.role() = 'service_role');

-- Usuarios: somente service_role pode ler e escrever (tabela sensivel)
CREATE POLICY "select_usuarios" ON usuarios FOR SELECT 
  USING (auth.role() = 'service_role');
CREATE POLICY "insert_usuarios" ON usuarios FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "update_usuarios" ON usuarios FOR UPDATE 
  USING (auth.role() = 'service_role');
CREATE POLICY "delete_usuarios" ON usuarios FOR DELETE 
  USING (auth.role() = 'service_role');

-- =============================================
-- FUNCAO PARA MONITORAMENTO DE USO
-- =============================================

CREATE OR REPLACE FUNCTION get_database_size()
RETURNS TABLE(
  table_name text,
  size_bytes bigint,
  size_pretty text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tablename::text,
    pg_total_relation_size('public.' || tablename)::bigint,
    pg_size_pretty(pg_total_relation_size('public.' || tablename))::text
  FROM pg_tables
  WHERE schemaname = 'public';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PRONTO! Banco configurado com seguranca.
-- =============================================
