'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

type Section = 'cores' | 'logo' | 'hero' | 'about' | 'showreel' | 'marquee' | 'navbar' | 'servicos' | 'numeros' | 'contato' | 'rodape';

export default function AdminHome() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('cores');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showreelImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const res = await fetch('/api/admin/configs');
      if (res.ok) {
        const data = await res.json();
        setConfigs(data);
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
        setMessage('Configuracoes salvas com sucesso!');
      } else {
        setMessage('Erro ao salvar configuracoes');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMessage('Erro ao salvar configuracoes');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
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
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Imagem muito grande. Maximo 5MB');
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
        setMessage('Imagem enviada! Clique em Salvar para aplicar.');
      } else {
        setMessage(data.error || 'Erro ao enviar imagem');
      }
    } catch (error) {
      setMessage('Erro ao enviar imagem');
    }

    setUploading(false);
    e.target.value = '';
  };

  if (loading) {
    return <div className="text-center text-gray-400">Carregando...</div>;
  }

  const sections = [
    { id: 'cores' as Section, label: 'Cores' },
    { id: 'logo' as Section, label: 'Logo' },
    { id: 'navbar' as Section, label: 'Menu' },
    { id: 'hero' as Section, label: 'Hero' },
    { id: 'about' as Section, label: 'Sobre' },
    { id: 'showreel' as Section, label: 'Showreel' },
    { id: 'marquee' as Section, label: 'Marquee' },
    { id: 'servicos' as Section, label: 'Diferenciais' },
    { id: 'numeros' as Section, label: 'Numeros' },
    { id: 'contato' as Section, label: 'Contato' },
    { id: 'rodape' as Section, label: 'Rodape' },
  ];

  const resetCores = () => {
    handleChange('cor_fundo', '#000000');
    handleChange('cor_texto', '#FFFFFF');
    handleChange('cor_texto_secundario', '#888888');
    handleChange('cor_destaque', '#FFFFFF');
    handleChange('cor_borda', '#333333');
    handleChange('cor_fundo_alt', '#FFFFFF');
    handleChange('cor_texto_alt', '#000000');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Pagina Inicial</h2>
          <p className="text-gray-400 text-sm mt-1">Edite os textos que aparecem no site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Alteracoes'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${
          message.includes('sucesso') || message.includes('enviada') 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {message}
        </div>
      )}

      {/* Tabs das secoes */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* CORES */}
      {activeSection === 'cores' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Tema Base</h4>
              <button onClick={resetCores} className="text-xs text-gray-500 hover:text-white">
                Resetar Padrao
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'cor_fundo', label: 'Fundo', default: '#000000' },
                { key: 'cor_texto', label: 'Texto', default: '#FFFFFF' },
                { key: 'cor_destaque', label: 'Destaque', default: '#FFFFFF' },
                { key: 'cor_texto_secundario', label: 'Secundario', default: '#888888' },
              ].map(({ key, label, default: def }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Detalhes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'cor_borda', label: 'Bordas', default: '#333333' },
                { key: 'cor_fundo_alt', label: 'Fundo Alt', default: '#FFFFFF' },
                { key: 'cor_texto_alt', label: 'Texto Alt', default: '#000000' },
              ].map(({ key, label, default: def }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={configs[key] || def}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="text-sm font-medium mb-3">Preview</h4>
            <div 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: configs['cor_fundo'] || '#000000',
                borderColor: configs['cor_borda'] || '#333333'
              }}
            >
              <h3 style={{ color: configs['cor_texto'] || '#FFFFFF' }} className="text-2xl font-light mb-2">
                TITULO EXEMPLO
              </h3>
              <p style={{ color: configs['cor_texto_secundario'] || '#888888' }} className="text-sm mb-4">
                Texto secundario de exemplo
              </p>
              <button
                className="px-4 py-2 text-sm border"
                style={{ borderColor: configs['cor_destaque'] || '#FFFFFF', color: configs['cor_destaque'] || '#FFFFFF' }}
              >
                BOTAO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGO */}
      {activeSection === 'logo' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Tipo:</span>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => handleChange('logo_tipo', 'texto')}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  configs['logo_tipo'] !== 'imagem' ? 'bg-white text-black' : 'text-gray-400'
                }`}
              >
                Texto
              </button>
              <button
                onClick={() => handleChange('logo_tipo', 'imagem')}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  configs['logo_tipo'] === 'imagem' ? 'bg-white text-black' : 'text-gray-400'
                }`}
              >
                Imagem
              </button>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-1">
              {configs['logo_tipo'] !== 'imagem' ? (
                <div>
                  <input
                    type="text"
                    value={configs['logo_texto'] || ''}
                    onChange={(e) => handleChange('logo_texto', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-xl tracking-widest"
                    placeholder="T\F"
                  />
                  <p className="text-xs text-gray-500 mt-2">Use \ ou / para barra estilizada</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={configs['logo_imagem_url'] || ''}
                    onChange={(e) => handleChange('logo_imagem_url', e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-sm"
                    placeholder="URL da imagem ou clique em upload"
                  />
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo', 'logo_imagem_url')} className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-black px-4 py-3 rounded-lg flex items-center justify-center">
              {configs['logo_tipo'] === 'imagem' && configs['logo_imagem_url']?.startsWith('http') ? (
                <img src={configs['logo_imagem_url']} alt="Logo" className="h-6 w-auto object-contain" />
              ) : (
                <span className="text-base font-light tracking-wide flex items-center">
                  {(configs['logo_texto'] || 'T/F').replace(/\\\\/g, '\\').split(/([/\\|])/).filter(Boolean).map((part, i) => 
                    part === '/' || part === '\\' || part === '|' 
                      ? <span key={i} className="text-white/40 text-sm mx-0.5">{part}</span> 
                      : <span key={i}>{part}</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR / MENU */}
      {activeSection === 'navbar' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Configure os links do menu de navegacao (ate 5 links)</p>
          
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex gap-3 items-center">
              <span className="text-gray-500 text-sm w-6">{num}.</span>
              <input
                type="text"
                value={configs[`nav_link${num}_label`] || ''}
                onChange={(e) => handleChange(`nav_link${num}_label`, e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-sm"
                placeholder="Texto do link (ex: INICIO)"
              />
              <input
                type="text"
                value={configs[`nav_link${num}_href`] || ''}
                onChange={(e) => handleChange(`nav_link${num}_href`, e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-sm"
                placeholder="Destino (ex: #sobre ou /galeria)"
              />
            </div>
          ))}
          
          <p className="text-xs text-gray-500 mt-4">
            Dica: Use # para links internos (ex: #sobre, #contato) ou URLs completas para links externos
          </p>
        </div>
      )}

      {/* HERO */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Titulo principal que aparece na abertura do site (4 linhas)</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Linha 1 (outline)</label>
              <input
                type="text"
                value={configs['hero_linha1'] || ''}
                onChange={(e) => handleChange('hero_linha1', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="ESPECIALISTAS"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Linha 2</label>
              <input
                type="text"
                value={configs['hero_linha2'] || ''}
                onChange={(e) => handleChange('hero_linha2', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="EM CAPTAR"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Linha 3 (italico)</label>
              <input
                type="text"
                value={configs['hero_linha3'] || ''}
                onChange={(e) => handleChange('hero_linha3', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="MOMENTOS"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Linha 4 (outline + italico)</label>
              <input
                type="text"
                value={configs['hero_linha4'] || ''}
                onChange={(e) => handleChange('hero_linha4', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="REAIS"
              />
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-800">
            <h4 className="text-sm font-medium mb-4">Video de Fundo (opcional)</h4>
            <input
              type="text"
              value={configs['video_fundo'] || ''}
              onChange={(e) => handleChange('video_fundo', e.target.value)}
              placeholder="URL do video (Cloudinary)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
            />
            <p className="text-xs text-gray-500 mt-2">Formato: MP4, 1920x1080, max 30MB, 10-30seg loop</p>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {activeSection === 'about' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Textos da secao Sobre</p>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Paragrafo 1</label>
            <textarea
              value={configs['about_paragrafo1'] || ''}
              onChange={(e) => handleChange('about_paragrafo1', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Frase de Destaque</label>
            <input
              type="text"
              value={configs['about_destaque'] || ''}
              onChange={(e) => handleChange('about_destaque', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              placeholder="TIERRIFILMS, Eternize o Real."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Paragrafo 2</label>
            <textarea
              value={configs['about_paragrafo2'] || ''}
              onChange={(e) => handleChange('about_paragrafo2', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              rows={4}
            />
          </div>
        </div>
      )}

      {/* SHOWREEL */}
      {activeSection === 'showreel' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Configuracoes da secao Showreel</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Titulo</label>
              <input
                type="text"
                value={configs['showreel_titulo'] || ''}
                onChange={(e) => handleChange('showreel_titulo', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="SHOWREEL"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Subtitulo</label>
              <input
                type="text"
                value={configs['showreel_subtitulo'] || ''}
                onChange={(e) => handleChange('showreel_subtitulo', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="TIERRIFILMS"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Texto</label>
              <input
                type="text"
                value={configs['showreel_texto'] || ''}
                onChange={(e) => handleChange('showreel_texto', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="Eternize o Real,"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Local</label>
              <input
                type="text"
                value={configs['showreel_local'] || ''}
                onChange={(e) => handleChange('showreel_local', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="SP (BR)"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <label className="block text-sm text-gray-400 mb-2">Imagem de Fundo</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={configs['showreel_imagem'] || ''}
                onChange={(e) => handleChange('showreel_imagem', e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-sm"
                placeholder="URL da imagem"
              />
              <input ref={showreelImageRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showreel', 'showreel_imagem')} className="hidden" />
              <button
                onClick={() => showreelImageRef.current?.click()}
                disabled={uploading}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">URL do Video (YouTube, Vimeo ou MP4)</label>
            <input
              type="text"
              value={configs['showreel_video_url'] || ''}
              onChange={(e) => handleChange('showreel_video_url', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
            />
            <p className="text-xs text-gray-500 mt-2">Deixe vazio para desabilitar o botao de play</p>
          </div>
        </div>
      )}

      {/* MARQUEE */}
      {activeSection === 'marquee' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Textos do banner que passa na tela</p>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Texto 1</label>
            <input
              type="text"
              value={configs['marquee_texto1'] || ''}
              onChange={(e) => handleChange('marquee_texto1', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              placeholder="PRODUCAO AUDIOVISUAL PARA CASAMENTOS E EVENTOS"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Texto 2</label>
            <input
              type="text"
              value={configs['marquee_texto2'] || ''}
              onChange={(e) => handleChange('marquee_texto2', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              placeholder="O OLHAR CINEMATOGRAFICO QUE ETERNIZA SEUS MELHORES MOMENTOS"
            />
          </div>
        </div>
      )}

      {/* SERVICOS / DIFERENCIAIS */}
      {activeSection === 'servicos' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Secao Por que a Tierrifilms - 3 diferenciais</p>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Titulo da Secao</label>
            <input
              type="text"
              value={configs['servicos_titulo'] || ''}
              onChange={(e) => handleChange('servicos_titulo', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              placeholder="PORQUE A TIERRIFILMS"
            />
          </div>

          {[1, 2, 3].map((num) => (
            <div key={num} className="p-4 bg-gray-800/50 rounded-lg space-y-3">
              <h4 className="text-sm font-medium text-white">Diferencial {num}</h4>
              <input
                type="text"
                value={configs[`diferencial${num}_titulo`] || ''}
                onChange={(e) => handleChange(`diferencial${num}_titulo`, e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white text-sm"
                placeholder="Titulo"
              />
              <input
                type="text"
                value={configs[`diferencial${num}_subtitulo`] || ''}
                onChange={(e) => handleChange(`diferencial${num}_subtitulo`, e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white text-sm"
                placeholder="Subtitulo"
              />
              <textarea
                value={configs[`diferencial${num}_descricao`] || ''}
                onChange={(e) => handleChange(`diferencial${num}_descricao`, e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white text-sm"
                rows={3}
                placeholder="Descricao"
              />
            </div>
          ))}
        </div>
      )}

      {/* NUMEROS */}
      {activeSection === 'numeros' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Estatisticas exibidas na secao Numeros</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="p-4 bg-gray-800/50 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-white">Estatistica {num}</h4>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={configs[`stat${num}_valor`] || ''}
                    onChange={(e) => handleChange(`stat${num}_valor`, e.target.value)}
                    className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white text-sm"
                    placeholder="150"
                  />
                  <input
                    type="text"
                    value={configs[`stat${num}_label`] || ''}
                    onChange={(e) => handleChange(`stat${num}_label`, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white text-sm"
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
          <p className="text-sm text-gray-500 mb-4">Configuracoes da secao de contato</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Titulo da Secao</label>
              <input
                type="text"
                value={configs['contato_titulo'] || ''}
                onChange={(e) => handleChange('contato_titulo', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="BORA FALAR!"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">WhatsApp (com codigo pais)</label>
              <input
                type="text"
                value={configs['whatsapp'] || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="5511999999999"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email de Contato</label>
              <input
                type="email"
                value={configs['email_contato'] || ''}
                onChange={(e) => handleChange('email_contato', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="contato@tierrifilms.com.br"
              />
            </div>
          </div>
        </div>
      )}

      {/* RODAPE */}
      {activeSection === 'rodape' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">Informacoes do rodape e redes sociais</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Slogan</label>
              <input
                type="text"
                value={configs['slogan_footer'] || ''}
                onChange={(e) => handleChange('slogan_footer', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="ETERNIZE O REAL"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Endereco</label>
              <input
                type="text"
                value={configs['endereco'] || ''}
                onChange={(e) => handleChange('endereco', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="SAO PAULO, SP"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Instagram</label>
              <input
                type="text"
                value={configs['instagram'] || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="https://instagram.com/tierrifilms"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">YouTube</label>
              <input
                type="text"
                value={configs['youtube'] || ''}
                onChange={(e) => handleChange('youtube', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="https://youtube.com/@tierrifilms"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Facebook</label>
              <input
                type="text"
                value={configs['facebook'] || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                placeholder="https://facebook.com/tierrifilms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
