'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, ChevronDown, Info } from 'lucide-react';
import { useMediaQuery } from '@/lib/useMediaQuery';
import SaveBar, { SaveButton } from './SaveBar';

type Section = 'geral' | 'cores' | 'logo' | 'hero' | 'about' | 'showreel' | 'marquee' | 'navbar' | 'servicos' | 'numeros' | 'contato' | 'rodape';

// Labels amigaveis para o cliente
const SECTION_LABELS: Record<Section, { label: string; description: string }> = {
  geral: { label: 'Titulo e Descricao', description: 'Nome do site e texto do Google' },
  cores: { label: 'Cores do Site', description: 'Personalize as cores' },
  logo: { label: 'Logo', description: 'Texto ou imagem do logo' },
  navbar: { label: 'Menu', description: 'Links de navegacao' },
  hero: { label: 'Abertura', description: 'Titulo principal e fundo' },
  about: { label: 'Sobre', description: 'Textos da secao Sobre' },
  showreel: { label: 'Showreel', description: 'Video de apresentacao' },
  marquee: { label: 'Texto Animado', description: 'Banner que passa na tela' },
  servicos: { label: 'Diferenciais', description: 'Por que escolher a Tierri' },
  numeros: { label: 'Estatisticas', description: 'Numeros em destaque' },
  contato: { label: 'Contato', description: 'WhatsApp e email' },
  rodape: { label: 'Rodape e Redes', description: 'Informacoes do rodape' },
};

export default function AdminHome() {
  const { isMobile } = useMediaQuery();
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [originalConfigs, setOriginalConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [activeSection, setActiveSection] = useState<Section>('geral');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showreelImageRef = useRef<HTMLInputElement>(null);
  const heroImageRef = useRef<HTMLInputElement>(null);

  // Detecta se ha alteracoes nao salvas
  const hasChanges = JSON.stringify(configs) !== JSON.stringify(originalConfigs);

  useEffect(() => {
    loadConfigs();
  }, []);

  // Aviso ao sair com alteracoes pendentes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const loadConfigs = async () => {
    try {
      const res = await fetch('/api/admin/configs');
      if (res.ok) {
        const data = await res.json();
        setConfigs(data);
        setOriginalConfigs(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configs:', error);
    }
    setLoading(false);
  };

  const handleChange = (chave: string, valor: string) => {
    setConfigs(prev => ({ ...prev, [chave]: valor }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configs)
      });

      if (res.ok) {
        setMessage('Salvo com sucesso!');
        setMessageType('success');
        setOriginalConfigs(configs);
      } else {
        setMessage('Erro ao salvar');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMessage('Erro ao salvar');
      setMessageType('error');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: string,
    configKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Selecione uma imagem (PNG, JPG, SVG)');
      setMessageType('error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Imagem muito grande. Maximo 5MB');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        handleChange(configKey, data.url);
        setMessage('Imagem enviada! Clique em Salvar.');
        setMessageType('success');
      } else {
        setMessage(data.error || 'Erro ao enviar imagem');
        setMessageType('error');
      }
    } catch {
      setMessage('Erro ao enviar imagem');
      setMessageType('error');
    }

    setUploading(false);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  const sections: Section[] = ['geral', 'cores', 'logo', 'navbar', 'hero', 'about', 'showreel', 'marquee', 'servicos', 'numeros', 'contato', 'rodape'];

  const resetCores = () => {
    handleChange('cor_fundo', '#000000');
    handleChange('cor_texto', '#FFFFFF');
    handleChange('cor_texto_secundario', '#888888');
    handleChange('cor_destaque', '#FFFFFF');
    handleChange('cor_borda', '#333333');
    handleChange('cor_fundo_alt', '#FFFFFF');
    handleChange('cor_texto_alt', '#000000');
  };

  // Componente de dica
  const Tip = ({ text }: { text: string }) => (
    <p className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      {text}
    </p>
  );

  // Input com estilo touch-friendly
  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all touch-input";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="relative">
      {/* Header com SaveBar em mobile */}
      {isMobile && (
        <SaveBar
          onSave={handleSave}
          saving={saving}
          hasChanges={hasChanges}
          message={message}
          messageType={messageType}
        />
      )}

      {/* Header Desktop */}
      {!isMobile && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Conteudo do Site</h2>
            <p className="text-gray-400 text-sm mt-1">Edite textos, imagens e configuracoes</p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && !message && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                Nao salvo
              </span>
            )}
            {message && (
              <span className={`text-sm ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </span>
            )}
            <SaveButton onSave={handleSave} saving={saving} hasChanges={hasChanges} />
          </div>
        </div>
      )}

      {/* Navegacao das secoes */}
      {isMobile ? (
        // Mobile: Dropdown Select
        <div className="relative mb-6">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value as Section)}
            className="w-full appearance-none px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white font-medium focus:outline-none focus:border-white pr-10"
          >
            {sections.map((section) => (
              <option key={section} value={section}>
                {SECTION_LABELS[section].label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <p className="text-xs text-gray-500 mt-2 px-1">
            {SECTION_LABELS[activeSection].description}
          </p>
        </div>
      ) : (
        // Desktop: Tabs de botoes
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-800">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2.5 text-sm rounded-lg transition-all ${
                activeSection === section
                  ? 'bg-white text-black font-medium'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {SECTION_LABELS[section].label}
            </button>
          ))}
        </div>
      )}

      {/* ===== SECOES DE CONTEUDO ===== */}

      {/* TITULO E DESCRICAO (antigo Geral/SEO) */}
      {activeSection === 'geral' && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Titulo do Site</label>
            <input
              type="text"
              value={configs['site_titulo'] || ''}
              onChange={(e) => handleChange('site_titulo', e.target.value)}
              className={inputClass}
              placeholder="TIERRIFILMS"
            />
            <Tip text="Aparece na aba do navegador e no Google" />
          </div>

          <div>
            <label className={labelClass}>Descricao</label>
            <textarea
              value={configs['site_descricao'] || ''}
              onChange={(e) => handleChange('site_descricao', e.target.value)}
              className={inputClass}
              rows={3}
              placeholder="Especialistas em captar momentos reais..."
            />
            <Tip text="Texto que aparece nos resultados do Google" />
          </div>
        </div>
      )}

      {/* CORES DO SITE */}
      {activeSection === 'cores' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Cores Principais</h4>
              <button onClick={resetCores} className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">
                Resetar Padrao
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'cor_fundo', label: 'Fundo do Site', default: '#000000' },
                { key: 'cor_texto', label: 'Texto Principal', default: '#FFFFFF' },
                { key: 'cor_destaque', label: 'Destaques', default: '#FFFFFF' },
                { key: 'cor_texto_secundario', label: 'Texto Secundario', default: '#888888' },
              ].map(({ key, label, default: def }) => (
                <div key={key} className="bg-gray-800/50 rounded-xl p-4">
                  <label className="block text-xs text-gray-400 mb-2">{label}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700 bg-transparent"
                    />
                    <input
                      type="text"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Cores Secundarias</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'cor_borda', label: 'Bordas e Linhas', default: '#333333' },
                { key: 'cor_fundo_alt', label: 'Fundo de Secoes Claras', default: '#FFFFFF' },
                { key: 'cor_texto_alt', label: 'Texto em Secoes Claras', default: '#000000' },
              ].map(({ key, label, default: def }) => (
                <div key={key} className="bg-gray-800/50 rounded-xl p-4">
                  <label className="block text-xs text-gray-400 mb-2">{label}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-700 bg-transparent"
                    />
                    <input
                      type="text"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="font-medium mb-4">Pre-visualizacao</h4>
            <div 
              className="p-6 rounded-2xl border-2"
              style={{ 
                backgroundColor: configs['cor_fundo'] || '#000000',
                borderColor: configs['cor_borda'] || '#333333'
              }}
            >
              <h3 style={{ color: configs['cor_texto'] || '#FFFFFF' }} className="text-2xl font-light mb-2">
                TITULO EXEMPLO
              </h3>
              <p style={{ color: configs['cor_texto_secundario'] || '#888888' }} className="text-sm mb-4">
                Texto secundario de exemplo para visualizacao
              </p>
              <button
                className="px-4 py-2 text-sm border rounded-lg"
                style={{ borderColor: configs['cor_destaque'] || '#FFFFFF', color: configs['cor_destaque'] || '#FFFFFF' }}
              >
                BOTAO EXEMPLO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGO */}
      {activeSection === 'logo' && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Tipo do Logo</label>
            <div className="flex bg-gray-800 rounded-xl p-1.5">
              <button
                onClick={() => handleChange('logo_tipo', 'texto')}
                className={`flex-1 px-4 py-2.5 text-sm rounded-lg transition-all ${
                  configs['logo_tipo'] !== 'imagem' ? 'bg-white text-black font-medium' : 'text-gray-400'
                }`}
              >
                Texto
              </button>
              <button
                onClick={() => handleChange('logo_tipo', 'imagem')}
                className={`flex-1 px-4 py-2.5 text-sm rounded-lg transition-all ${
                  configs['logo_tipo'] === 'imagem' ? 'bg-white text-black font-medium' : 'text-gray-400'
                }`}
              >
                Imagem
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1 w-full">
              {configs['logo_tipo'] !== 'imagem' ? (
                <div>
                  <label className={labelClass}>Texto do Logo</label>
                  <input
                    type="text"
                    value={configs['logo_texto'] || ''}
                    onChange={(e) => handleChange('logo_texto', e.target.value)}
                    className={`${inputClass} text-xl tracking-widest`}
                    placeholder="T\F"
                  />
                  <Tip text="Use \ ou / para criar a barra estilizada" />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Imagem do Logo</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={configs['logo_imagem_url'] || ''}
                      onChange={(e) => handleChange('logo_imagem_url', e.target.value)}
                      className={`${inputClass} flex-1 text-sm`}
                      placeholder="URL da imagem ou clique em upload"
                    />
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo', 'logo_imagem_url')} className="hidden" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview do logo */}
            <div className="bg-black px-6 py-4 rounded-xl border border-gray-800">
              <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider">Preview</p>
              {configs['logo_tipo'] === 'imagem' && configs['logo_imagem_url']?.startsWith('http') ? (
                <img src={configs['logo_imagem_url']} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-xl font-light tracking-wide flex items-center">
                  {(configs['logo_texto'] || 'T/F').replace(/\\\\/g, '\\').split(/([/\\|])/).filter(Boolean).map((part, i) => 
                    part === '/' || part === '\\' || part === '|' 
                      ? <span key={i} className="text-white/40 text-lg mx-0.5">{part}</span> 
                      : <span key={i}>{part}</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MENU / NAVBAR */}
      {activeSection === 'navbar' && (
        <div className="space-y-4">
          {/* Explicacao */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              <strong>Menu de Navegacao</strong> - Esses links aparecem quando o visitante clica no icone de menu (3 linhas no canto superior direito).
            </p>
            <p className="text-xs text-blue-300/70 mt-2">
              Links vazios nao aparecem no menu. Deixe em branco o que nao quiser mostrar.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            {[
              { num: 1, sugestao: 'INICIO', destino: '#', dica: 'Volta ao topo da pagina' },
              { num: 2, sugestao: 'SOBRE', destino: '#sobre', dica: 'Ancora para secao Sobre' },
              { num: 3, sugestao: 'CASES', destino: '#cases', dica: 'Ancora para secao Cases' },
              { num: 4, sugestao: 'EQUIPE', destino: '#equipe', dica: 'Ancora para Equipe' },
              { num: 5, sugestao: 'CONTATO', destino: '#contato', dica: 'Ancora para Contato' },
            ].map(({ num, sugestao, destino, dica }) => (
              <div key={num} className="bg-gray-800/30 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Texto do link</label>
                    <input
                      type="text"
                      value={configs[`nav_link${num}_label`] || ''}
                      onChange={(e) => handleChange(`nav_link${num}_label`, e.target.value)}
                      className={inputClass}
                      placeholder={sugestao}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Destino <span className="text-gray-600">({dica})</span></label>
                    <input
                      type="text"
                      value={configs[`nav_link${num}_href`] || ''}
                      onChange={(e) => handleChange(`nav_link${num}_href`, e.target.value)}
                      className={inputClass}
                      placeholder={destino}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dica final */}
          <div className="text-xs text-gray-500 space-y-1 px-1">
            <p><strong>#</strong> = Volta ao topo | <strong>#sobre</strong> = Vai para secao Sobre | <strong>#contato</strong> = Vai para Contato</p>
            <p>Para links externos, use a URL completa: <span className="text-gray-400">https://instagram.com/tierrifilms</span></p>
          </div>
        </div>
      )}

      {/* ABERTURA (antigo Hero) */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Titulo Principal (4 linhas)</h4>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className={labelClass}>Linha 1 <span className="text-gray-500 font-normal">(contorno)</span></label>
                <input
                  type="text"
                  value={configs['hero_linha1'] || ''}
                  onChange={(e) => handleChange('hero_linha1', e.target.value)}
                  className={inputClass}
                  placeholder="ESPECIALISTAS"
                />
              </div>
              <div>
                <label className={labelClass}>Linha 2</label>
                <input
                  type="text"
                  value={configs['hero_linha2'] || ''}
                  onChange={(e) => handleChange('hero_linha2', e.target.value)}
                  className={inputClass}
                  placeholder="EM CAPTAR"
                />
              </div>
              <div>
                <label className={labelClass}>Linha 3 <span className="text-gray-500 font-normal">(italico)</span></label>
                <input
                  type="text"
                  value={configs['hero_linha3'] || ''}
                  onChange={(e) => handleChange('hero_linha3', e.target.value)}
                  className={inputClass}
                  placeholder="MOMENTOS"
                />
              </div>
              <div>
                <label className={labelClass}>Linha 4 <span className="text-gray-500 font-normal">(contorno + italico)</span></label>
                <input
                  type="text"
                  value={configs['hero_linha4'] || ''}
                  onChange={(e) => handleChange('hero_linha4', e.target.value)}
                  className={inputClass}
                  placeholder="REAIS"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-800">
            <h4 className="font-medium mb-4">Fundo da Abertura</h4>
            <Tip text="Se preencher video E imagem, o video tem prioridade. Se ambos vazios, fica fundo preto." />
            
            {/* Imagem de Fundo */}
            <div className="mt-4 bg-gray-800/30 rounded-xl p-4">
              <label className={labelClass}>Imagem de Fundo</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={configs['hero_imagem_fundo'] || ''}
                  onChange={(e) => handleChange('hero_imagem_fundo', e.target.value)}
                  className={`${inputClass} flex-1 text-sm`}
                  placeholder="URL da imagem ou clique em upload"
                />
                <input ref={heroImageRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', 'hero_imagem_fundo')} className="hidden" />
                <button
                  onClick={() => heroImageRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
              {configs['hero_imagem_fundo'] && (
                <div className="mt-3 flex items-center gap-3">
                  <img src={configs['hero_imagem_fundo']} alt="Preview" className="w-24 h-14 object-cover rounded-lg" />
                  <button
                    onClick={() => handleChange('hero_imagem_fundo', '')}
                    className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            {/* Video de Fundo */}
            <div className="mt-4 bg-gray-800/30 rounded-xl p-4">
              <label className={labelClass}>Video de Fundo <span className="text-amber-400 font-normal">(prioridade)</span></label>
              <input
                type="text"
                value={configs['video_fundo'] || ''}
                onChange={(e) => handleChange('video_fundo', e.target.value)}
                placeholder="URL do video (Cloudinary ou similar)"
                className={inputClass}
              />
              <Tip text="Formato: MP4, 1920x1080, max 30MB, ideal 10-30 segundos em loop" />
            </div>
          </div>
        </div>
      )}

      {/* SOBRE */}
      {activeSection === 'about' && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Primeiro Paragrafo</label>
            <textarea
              value={configs['about_paragrafo1'] || ''}
              onChange={(e) => handleChange('about_paragrafo1', e.target.value)}
              className={inputClass}
              rows={4}
              placeholder="Texto introdutorio sobre a empresa..."
            />
          </div>
          <div>
            <label className={labelClass}>Frase de Destaque</label>
            <input
              type="text"
              value={configs['about_destaque'] || ''}
              onChange={(e) => handleChange('about_destaque', e.target.value)}
              className={inputClass}
              placeholder="TIERRIFILMS, Eternize o Real."
            />
            <Tip text="Esta frase aparece em destaque no meio da secao" />
          </div>
          <div>
            <label className={labelClass}>Segundo Paragrafo</label>
            <textarea
              value={configs['about_paragrafo2'] || ''}
              onChange={(e) => handleChange('about_paragrafo2', e.target.value)}
              className={inputClass}
              rows={4}
              placeholder="Mais detalhes sobre experiencia e equipe..."
            />
          </div>
        </div>
      )}

      {/* SHOWREEL */}
      {activeSection === 'showreel' && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label className={labelClass}>Titulo</label>
              <input
                type="text"
                value={configs['showreel_titulo'] || ''}
                onChange={(e) => handleChange('showreel_titulo', e.target.value)}
                className={inputClass}
                placeholder="SHOWREEL"
              />
            </div>
            <div>
              <label className={labelClass}>Subtitulo</label>
              <input
                type="text"
                value={configs['showreel_subtitulo'] || ''}
                onChange={(e) => handleChange('showreel_subtitulo', e.target.value)}
                className={inputClass}
                placeholder="TIERRIFILMS"
              />
            </div>
            <div>
              <label className={labelClass}>Texto</label>
              <input
                type="text"
                value={configs['showreel_texto'] || ''}
                onChange={(e) => handleChange('showreel_texto', e.target.value)}
                className={inputClass}
                placeholder="Eternize o Real,"
              />
            </div>
            <div>
              <label className={labelClass}>Local</label>
              <input
                type="text"
                value={configs['showreel_local'] || ''}
                onChange={(e) => handleChange('showreel_local', e.target.value)}
                className={inputClass}
                placeholder="SP (BR)"
              />
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4">
            <label className={labelClass}>Imagem de Fundo</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={configs['showreel_imagem'] || ''}
                onChange={(e) => handleChange('showreel_imagem', e.target.value)}
                className={`${inputClass} flex-1 text-sm`}
                placeholder="URL da imagem"
              />
              <input ref={showreelImageRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showreel', 'showreel_imagem')} className="hidden" />
              <button
                onClick={() => showreelImageRef.current?.click()}
                disabled={uploading}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>URL do Video</label>
            <input
              type="text"
              value={configs['showreel_video_url'] || ''}
              onChange={(e) => handleChange('showreel_video_url', e.target.value)}
              className={inputClass}
              placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
            />
            <Tip text="Deixe vazio para desabilitar o botao de play" />
          </div>
        </div>
      )}

      {/* TEXTO ANIMADO (antigo Marquee) */}
      {activeSection === 'marquee' && (
        <div className="space-y-6">
          <Tip text="Estes textos aparecem em um banner que passa continuamente na tela" />
          
          <div>
            <label className={labelClass}>Texto 1</label>
            <input
              type="text"
              value={configs['marquee_texto1'] || ''}
              onChange={(e) => handleChange('marquee_texto1', e.target.value)}
              className={inputClass}
              placeholder="PRODUCAO AUDIOVISUAL PARA CASAMENTOS E EVENTOS"
            />
          </div>
          <div>
            <label className={labelClass}>Texto 2</label>
            <input
              type="text"
              value={configs['marquee_texto2'] || ''}
              onChange={(e) => handleChange('marquee_texto2', e.target.value)}
              className={inputClass}
              placeholder="O OLHAR CINEMATOGRAFICO QUE ETERNIZA SEUS MELHORES MOMENTOS"
            />
          </div>
        </div>
      )}

      {/* DIFERENCIAIS (antigo Servicos) */}
      {activeSection === 'servicos' && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Titulo da Secao</label>
            <input
              type="text"
              value={configs['servicos_titulo'] || ''}
              onChange={(e) => handleChange('servicos_titulo', e.target.value)}
              className={inputClass}
              placeholder="PORQUE A TIERRIFILMS"
            />
          </div>

          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-gray-800/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold">{num}</span>
                <span className="font-medium">Diferencial {num}</span>
              </div>
              <input
                type="text"
                value={configs[`diferencial${num}_titulo`] || ''}
                onChange={(e) => handleChange(`diferencial${num}_titulo`, e.target.value)}
                className={inputClass}
                placeholder="Titulo do diferencial"
              />
              <input
                type="text"
                value={configs[`diferencial${num}_subtitulo`] || ''}
                onChange={(e) => handleChange(`diferencial${num}_subtitulo`, e.target.value)}
                className={inputClass}
                placeholder="Subtitulo curto"
              />
              <textarea
                value={configs[`diferencial${num}_descricao`] || ''}
                onChange={(e) => handleChange(`diferencial${num}_descricao`, e.target.value)}
                className={inputClass}
                rows={3}
                placeholder="Descricao detalhada..."
              />
            </div>
          ))}
        </div>
      )}

      {/* ESTATISTICAS (antigo Numeros) */}
      {activeSection === 'numeros' && (
        <div className="space-y-6">
          <Tip text="Numeros que aparecem em destaque no site" />
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-gray-800/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400">{num}</span>
                  <span className="text-sm text-gray-400">Estatistica {num}</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={configs[`stat${num}_valor`] || ''}
                    onChange={(e) => handleChange(`stat${num}_valor`, e.target.value)}
                    className={`${inputClass} w-28`}
                    placeholder="150"
                  />
                  <input
                    type="text"
                    value={configs[`stat${num}_label`] || ''}
                    onChange={(e) => handleChange(`stat${num}_label`, e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="PRODUCOES"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTATO */}
      {activeSection === 'contato' && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label className={labelClass}>Titulo da Secao</label>
              <input
                type="text"
                value={configs['contato_titulo'] || ''}
                onChange={(e) => handleChange('contato_titulo', e.target.value)}
                className={inputClass}
                placeholder="BORA FALAR!"
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input
                type="text"
                value={configs['whatsapp'] || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className={inputClass}
                placeholder="5511999999999"
              />
              <Tip text="Numero completo com codigo do pais (55) e DDD" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Email de Contato</label>
              <input
                type="email"
                value={configs['email_contato'] || ''}
                onChange={(e) => handleChange('email_contato', e.target.value)}
                className={inputClass}
                placeholder="contato@tierrifilms.com.br"
              />
            </div>
          </div>
        </div>
      )}

      {/* RODAPE E REDES */}
      {activeSection === 'rodape' && (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <label className={labelClass}>Slogan</label>
              <input
                type="text"
                value={configs['slogan_footer'] || ''}
                onChange={(e) => handleChange('slogan_footer', e.target.value)}
                className={inputClass}
                placeholder="ETERNIZE O REAL"
              />
            </div>
            <div>
              <label className={labelClass}>Endereco / Cidade</label>
              <input
                type="text"
                value={configs['endereco'] || ''}
                onChange={(e) => handleChange('endereco', e.target.value)}
                className={inputClass}
                placeholder="SAO PAULO, SP"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <h4 className="font-medium mb-4">Redes Sociais</h4>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div>
                <label className={labelClass}>Instagram</label>
                <input
                  type="text"
                  value={configs['instagram'] || ''}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className={inputClass}
                  placeholder="https://instagram.com/tierrifilms"
                />
              </div>
              <div>
                <label className={labelClass}>YouTube</label>
                <input
                  type="text"
                  value={configs['youtube'] || ''}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  className={inputClass}
                  placeholder="https://youtube.com/@tierrifilms"
                />
              </div>
              <div>
                <label className={labelClass}>Facebook</label>
                <input
                  type="text"
                  value={configs['facebook'] || ''}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  className={inputClass}
                  placeholder="https://facebook.com/tierrifilms"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
