'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Galeria, GaleriaFoto, Categoria } from '@/lib/supabase';
import { CldUploadWidget } from 'next-cloudinary';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { 
  ChevronLeft, ChevronDown, Plus, Image, Trash2, Edit2, X, Star, 
  Video, Play, Settings, FolderPlus, ImagePlus, Film
} from 'lucide-react';

type MobileView = 'list' | 'details';
type MidiaTab = 'todas' | 'fotos' | 'videos';

// ==================== INTERFACES ====================

interface GaleriasListProps {
  isMobile: boolean;
  galerias: Galeria[];
  categorias: Categoria[];
  galeriasFiltradas: Galeria[];
  selectedGaleria: Galeria | null;
  filtroCategoria: string;
  principaisCount: number;
  maxPrincipais: number;
  selectClass: string;
  onSelectGaleria: (galeria: Galeria) => void;
  onDeleteGaleria: (id: string) => void;
  onNewGaleria: () => void;
  onOpenCategorias: () => void;
  onFilterChange: (value: string) => void;
  getYouTubeThumbnail: (url: string) => string | null;
}

interface GaleriaDetailsProps {
  isMobile: boolean;
  selectedGaleria: Galeria | null;
  midias: GaleriaFoto[];
  midiasFiltradas: GaleriaFoto[];
  midiaTab: MidiaTab;
  fotosCount: number;
  videosCount: number;
  onBackToList: () => void;
  onEditGaleria: () => void;
  onUpdateCapa: (url: string, tipo: 'imagem' | 'video') => void;
  onUploadComplete: (result: { info?: { secure_url?: string } }) => void;
  onOpenVideoModal: () => void;
  onMidiaTabChange: (tab: MidiaTab) => void;
  onDeleteMidia: (id: string) => void;
  isYouTubeUrl: (url: string) => boolean;
  getYouTubeThumbnail: (url: string) => string | null;
}

// ==================== COMPONENTES EXTERNOS ====================

function GaleriasList({
  isMobile,
  galerias,
  categorias,
  galeriasFiltradas,
  selectedGaleria,
  filtroCategoria,
  principaisCount,
  maxPrincipais,
  selectClass,
  onSelectGaleria,
  onDeleteGaleria,
  onNewGaleria,
  onOpenCategorias,
  onFilterChange,
  getYouTubeThumbnail,
}: GaleriasListProps) {
  return (
    <div className={isMobile ? '' : 'w-80 flex-shrink-0 border-r border-gray-800 pr-6'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Galerias</h2>
          <p className={`text-xs mt-0.5 ${principaisCount >= maxPrincipais ? 'text-amber-400' : 'text-gray-500'}`}>
            <Star className="w-3 h-3 inline mr-1" />
            {principaisCount}/{maxPrincipais} na Home
          </p>
        </div>
        <button
          onClick={onNewGaleria}
          className="p-2.5 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors"
          title="Nova Galeria"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filtro Dropdown + Botao Categorias */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <select
            value={filtroCategoria}
            onChange={(e) => onFilterChange(e.target.value)}
            className={selectClass}
          >
            <option value="todas">Todas ({galerias.length})</option>
            {categorias.map(cat => {
              const count = galerias.filter(g => g.categoria === cat.nome).length;
              return (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome} ({count})
                </option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        <button
          onClick={onOpenCategorias}
          className="p-2.5 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 hover:text-white transition-colors"
          title="Gerenciar Categorias"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
        {galeriasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma galeria</p>
          </div>
        ) : (
          galeriasFiltradas.map((galeria) => (
            <div
              key={galeria.id}
              onClick={() => onSelectGaleria(galeria)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                selectedGaleria?.id === galeria.id && !isMobile
                  ? 'bg-white text-black'
                  : 'bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 relative">
                  {galeria.capa_url ? (
                    <>
                      <img 
                        src={galeria.capa_tipo === 'video' ? getYouTubeThumbnail(galeria.capa_url) || galeria.capa_url : galeria.capa_url} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      {galeria.capa_tipo === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm flex items-center gap-1">
                    {galeria.is_principal && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                    <span className="truncate">{galeria.nome}</span>
                  </p>
                  <p className={`text-xs truncate ${
                    selectedGaleria?.id === galeria.id && !isMobile ? 'text-gray-600' : 'text-gray-500'
                  }`}>
                    {galeria.categoria || 'Sem categoria'}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGaleria(galeria.id);
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GaleriaDetails({
  isMobile,
  selectedGaleria,
  midias,
  midiasFiltradas,
  midiaTab,
  fotosCount,
  videosCount,
  onBackToList,
  onEditGaleria,
  onUpdateCapa,
  onUploadComplete,
  onOpenVideoModal,
  onMidiaTabChange,
  onDeleteMidia,
  isYouTubeUrl,
  getYouTubeThumbnail,
}: GaleriaDetailsProps) {
  return (
    <div className={isMobile ? '' : 'flex-1 min-w-0 pl-6'}>
      {selectedGaleria ? (
        <div className="space-y-6">
          {/* Header Mobile */}
          {isMobile && (
            <button
              onClick={onBackToList}
              className="flex items-center gap-2 text-gray-400 hover:text-white -ml-1"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
          )}

          {/* Info da Galeria */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold truncate">{selectedGaleria.nome}</h3>
              <p className="text-sm text-gray-400 mt-1">{selectedGaleria.categoria || 'Sem categoria'}</p>
              {selectedGaleria.descricao && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{selectedGaleria.descricao}</p>
              )}
            </div>
            <button
              onClick={onEditGaleria}
              className="p-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Capa */}
          <div className="bg-gray-800/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-300">Capa</h4>
              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded-lg">
                {selectedGaleria.capa_tipo === 'video' ? 'Video' : 'Imagem'}
              </span>
            </div>
            
            <div className="flex gap-4">
              {/* Preview */}
              <div className="w-32 h-20 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 relative">
                {selectedGaleria.capa_url ? (
                  <>
                    <img
                      src={selectedGaleria.capa_tipo === 'video' ? getYouTubeThumbnail(selectedGaleria.capa_url) || '' : selectedGaleria.capa_url}
                      alt="Capa"
                      className="w-full h-full object-cover"
                    />
                    {selectedGaleria.capa_tipo === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Image className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Botoes */}
              <div className="flex flex-col gap-2 flex-1">
                <CldUploadWidget
                  key={`capa-${selectedGaleria.id}`}
                  uploadPreset="tierrifilms"
                  options={{ folder: 'tierrifilms/capas' }}
                  onSuccess={(result) => {
                    const r = result as { info?: { secure_url?: string } };
                    if (r.info?.secure_url) onUpdateCapa(r.info.secure_url, 'imagem');
                  }}
                >
                  {({ open }) => (
                    <button 
                      onClick={() => open()} 
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <ImagePlus className="w-4 h-4" />
                      <span>Imagem</span>
                    </button>
                  )}
                </CldUploadWidget>
                <button
                  onClick={() => {
                    const url = prompt('Cole a URL do video do YouTube:');
                    if (url) {
                      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
                      if (youtubeMatch) {
                        onUpdateCapa(`https://www.youtube.com/embed/${youtubeMatch[1]}`, 'video');
                      } else {
                        alert('URL do YouTube invalida');
                      }
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Film className="w-4 h-4" />
                  <span>Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* Midias */}
          <div>
            {/* Header Midias */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300">Midias</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {fotosCount} foto{fotosCount !== 1 && 's'}, {videosCount} video{videosCount !== 1 && 's'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onOpenVideoModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Video</span>
                </button>
                <CldUploadWidget
                  key={`fotos-${selectedGaleria.id}`}
                  uploadPreset="tierrifilms"
                  options={{ 
                    folder: `tierrifilms/galerias/${selectedGaleria.slug}`,
                    multiple: true,
                    maxFiles: 50,
                  }}
                  onSuccess={(result) => {
                    const r = result as { info?: { secure_url?: string } };
                    onUploadComplete(r);
                  }}
                >
                  {({ open }) => (
                    <button 
                      onClick={() => open()} 
                      className="flex items-center gap-1.5 px-3 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Fotos</span>
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>

            {/* Tabs de filtro */}
            {midias.length > 0 && (
              <div className="flex gap-1 mb-4 p-1 bg-gray-800/50 rounded-lg w-fit">
                {(['todas', 'fotos', 'videos'] as MidiaTab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => onMidiaTabChange(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      midiaTab === tab 
                        ? 'bg-white text-black' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'todas' ? `Todas (${midias.length})` : tab === 'fotos' ? `Fotos (${fotosCount})` : `Videos (${videosCount})`}
                  </button>
                ))}
              </div>
            )}

            {/* Grid de Midias */}
            {midiasFiltradas.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {midiasFiltradas.map((midia) => (
                  <div key={midia.id} className="relative group aspect-square">
                    {midia.tipo === 'video' ? (
                      <>
                        <img
                          src={isYouTubeUrl(midia.foto_url) ? getYouTubeThumbnail(midia.foto_url) || '' : ''}
                          alt=""
                          className="w-full h-full object-cover rounded-xl bg-gray-800"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={midia.foto_url}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    )}
                    <button
                      onClick={() => onDeleteMidia(midia.id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
                <Image className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma midia ainda</p>
                <p className="text-gray-600 text-sm mt-1">Adicione fotos ou videos</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <Image className="w-12 h-12 mb-4 text-gray-600" />
          <p>Selecione uma galeria</p>
        </div>
      )}
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

export default function AdminGalerias() {
  const { isMobile } = useMediaQuery();
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGaleria, setSelectedGaleria] = useState<Galeria | null>(null);
  const [midias, setMidias] = useState<GaleriaFoto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingGaleria, setEditingGaleria] = useState<Partial<Galeria> | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('list');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [midiaTab, setMidiaTab] = useState<MidiaTab>('todas');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const selectedGaleriaRef = useRef<Galeria | null>(null);
  const midiasRef = useRef<GaleriaFoto[]>([]);

  useEffect(() => {
    selectedGaleriaRef.current = selectedGaleria;
  }, [selectedGaleria]);

  useEffect(() => {
    midiasRef.current = midias;
  }, [midias]);

  useEffect(() => {
    loadGalerias();
    loadCategorias();
  }, []);

  // ==================== HELPERS ====================

  const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

  const getYouTubeThumbnail = useCallback((url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  }, []);

  // ==================== API CALLS ====================

  const loadGalerias = async () => {
    try {
      const res = await fetch('/api/admin/galerias');
      if (res.ok) {
        const data = await res.json();
        setGalerias(data);
      }
    } catch (error) {
      console.error('Erro ao carregar galerias:', error);
    }
    setLoading(false);
  };

  const loadCategorias = async () => {
    try {
      const res = await fetch('/api/admin/categorias');
      if (res.ok) {
        const data = await res.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadMidias = async (galeriaId: string) => {
    try {
      const res = await fetch(`/api/admin/galerias/fotos?galeria_id=${galeriaId}`);
      if (res.ok) {
        const data = await res.json();
        setMidias(data);
      }
    } catch (error) {
      console.error('Erro ao carregar midias:', error);
    }
  };

  // ==================== HANDLERS ====================

  const handleSelectGaleria = useCallback(async (galeria: Galeria) => {
    setSelectedGaleria(galeria);
    setMidiaTab('todas');
    await loadMidias(galeria.id);
    if (isMobile) {
      setMobileView('details');
    }
  }, [isMobile]);

  const handleBackToList = useCallback(() => {
    setMobileView('list');
    setSelectedGaleria(null);
    setMidias([]);
  }, []);

  const handleSaveGaleria = async () => {
    if (!editingGaleria) return;
    setSaving(true);

    try {
      let response;

      if (editingGaleria.id) {
        response = await fetch('/api/admin/galerias', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingGaleria),
        });
      } else {
        response = await fetch('/api/admin/galerias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingGaleria,
            ordem: galerias.length + 1
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao salvar galeria');
        setSaving(false);
        return;
      }

      setShowModal(false);
      setEditingGaleria(null);
      await loadGalerias();

      if (editingGaleria.id && selectedGaleria?.id === editingGaleria.id) {
        const res = await fetch('/api/admin/galerias');
        if (res.ok) {
          const data = await res.json();
          const updated = data.find((g: Galeria) => g.id === editingGaleria.id);
          if (updated) setSelectedGaleria(updated);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar galeria:', error);
      alert('Erro ao salvar galeria');
    }
    setSaving(false);
  };

  const handleDeleteGaleria = useCallback(async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta galeria e todas as suas midias?')) {
      try {
        await fetch(`/api/admin/galerias?id=${id}`, { method: 'DELETE' });
        await loadGalerias();
        if (selectedGaleriaRef.current?.id === id) {
          setSelectedGaleria(null);
          setMidias([]);
          setMobileView('list');
        }
      } catch (error) {
        console.error('Erro ao deletar galeria:', error);
      }
    }
  }, []);

  const handleUploadComplete = useCallback(async (result: { info?: { secure_url?: string } }) => {
    const currentGaleria = selectedGaleriaRef.current;
    const currentMidias = midiasRef.current;

    if (!currentGaleria || !result.info?.secure_url) return;

    try {
      await fetch('/api/admin/galerias/fotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          galeria_id: currentGaleria.id,
          foto_url: result.info.secure_url,
          ordem: currentMidias.length + 1,
          tipo: 'foto'
        }),
      });

      await loadMidias(currentGaleria.id);
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
    }
  }, []);

  const handleAddVideo = async () => {
    if (!selectedGaleria || !videoUrl.trim()) return;

    let finalUrl = videoUrl.trim();
    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (youtubeMatch) {
      finalUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    try {
      await fetch('/api/admin/galerias/fotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          galeria_id: selectedGaleria.id,
          foto_url: finalUrl,
          ordem: midias.length + 1,
          tipo: 'video'
        }),
      });

      await loadMidias(selectedGaleria.id);
      setVideoUrl('');
      setShowVideoModal(false);
    } catch (error) {
      console.error('Erro ao adicionar video:', error);
    }
  };

  const handleDeleteMidia = useCallback(async (midiaId: string) => {
    if (confirm('Excluir esta midia?')) {
      try {
        await fetch(`/api/admin/galerias/fotos?id=${midiaId}`, { method: 'DELETE' });
        const currentGaleria = selectedGaleriaRef.current;
        if (currentGaleria) await loadMidias(currentGaleria.id);
      } catch (error) {
        console.error('Erro ao deletar midia:', error);
      }
    }
  }, []);

  const handleUpdateCapa = useCallback(async (url: string, tipo: 'imagem' | 'video' = 'imagem') => {
    const currentGaleria = selectedGaleriaRef.current;
    if (!currentGaleria) return;

    try {
      await fetch('/api/admin/galerias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentGaleria.id,
          capa_url: url,
          capa_tipo: tipo
        }),
      });

      setSelectedGaleria(prev => prev ? { ...prev, capa_url: url, capa_tipo: tipo } : null);
      await loadGalerias();
    } catch (error) {
      console.error('Erro ao atualizar capa:', error);
    }
  }, []);

  const handleAddCategoria = async () => {
    if (!novaCategoria.trim()) return;

    try {
      const res = await fetch('/api/admin/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novaCategoria.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Erro ao criar categoria');
        return;
      }

      await loadCategorias();
      setNovaCategoria('');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  const handleDeleteCategoria = async (id: string) => {
    if (confirm('Excluir esta categoria?')) {
      try {
        const res = await fetch(`/api/admin/categorias?id=${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Erro ao excluir categoria');
          return;
        }
        await loadCategorias();
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
      }
    }
  };

  // ==================== COMPUTED ====================

  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all";
  const selectClass = "w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all text-sm appearance-none cursor-pointer";

  const galeriasFiltradas = filtroCategoria === 'todas'
    ? galerias
    : galerias.filter(g => g.categoria === filtroCategoria);

  const midiasFiltradas = midiaTab === 'todas'
    ? midias
    : midias.filter(m => m.tipo === (midiaTab === 'fotos' ? 'foto' : 'video'));

  const principaisCount = galerias.filter(g => g.is_principal).length;
  const MAX_PRINCIPAIS = 6;
  const fotosCount = midias.filter(m => m.tipo !== 'video').length;
  const videosCount = midias.filter(m => m.tipo === 'video').length;

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  // ==================== RENDER ====================

  return (
    <div>
      {isMobile ? (
        <div>
          {mobileView === 'list' ? (
            <GaleriasList
              isMobile={isMobile}
              galerias={galerias}
              categorias={categorias}
              galeriasFiltradas={galeriasFiltradas}
              selectedGaleria={selectedGaleria}
              filtroCategoria={filtroCategoria}
              principaisCount={principaisCount}
              maxPrincipais={MAX_PRINCIPAIS}
              selectClass={selectClass}
              onSelectGaleria={handleSelectGaleria}
              onDeleteGaleria={handleDeleteGaleria}
              onNewGaleria={() => {
                setEditingGaleria({ nome: '', categoria: '', descricao: '', capa_tipo: 'imagem' });
                setShowModal(true);
              }}
              onOpenCategorias={() => setShowCategoriaModal(true)}
              onFilterChange={setFiltroCategoria}
              getYouTubeThumbnail={getYouTubeThumbnail}
            />
          ) : (
            <GaleriaDetails
              isMobile={isMobile}
              selectedGaleria={selectedGaleria}
              midias={midias}
              midiasFiltradas={midiasFiltradas}
              midiaTab={midiaTab}
              fotosCount={fotosCount}
              videosCount={videosCount}
              onBackToList={handleBackToList}
              onEditGaleria={() => {
                setEditingGaleria(selectedGaleria);
                setShowModal(true);
              }}
              onUpdateCapa={handleUpdateCapa}
              onUploadComplete={handleUploadComplete}
              onOpenVideoModal={() => setShowVideoModal(true)}
              onMidiaTabChange={setMidiaTab}
              onDeleteMidia={handleDeleteMidia}
              isYouTubeUrl={isYouTubeUrl}
              getYouTubeThumbnail={getYouTubeThumbnail}
            />
          )}
        </div>
      ) : (
        <div className="flex min-h-[600px]">
            <GaleriasList
              isMobile={isMobile}
              galerias={galerias}
              categorias={categorias}
              galeriasFiltradas={galeriasFiltradas}
              selectedGaleria={selectedGaleria}
              filtroCategoria={filtroCategoria}
              principaisCount={principaisCount}
              maxPrincipais={MAX_PRINCIPAIS}
              selectClass={selectClass}
              onSelectGaleria={handleSelectGaleria}
              onDeleteGaleria={handleDeleteGaleria}
              onNewGaleria={() => {
                setEditingGaleria({ nome: '', categoria: '', descricao: '', capa_tipo: 'imagem' });
                setShowModal(true);
              }}
              onOpenCategorias={() => setShowCategoriaModal(true)}
              onFilterChange={setFiltroCategoria}
              getYouTubeThumbnail={getYouTubeThumbnail}
            />
            <GaleriaDetails
              isMobile={isMobile}
              selectedGaleria={selectedGaleria}
              midias={midias}
              midiasFiltradas={midiasFiltradas}
              midiaTab={midiaTab}
              fotosCount={fotosCount}
              videosCount={videosCount}
              onBackToList={handleBackToList}
              onEditGaleria={() => {
                setEditingGaleria(selectedGaleria);
                setShowModal(true);
              }}
              onUpdateCapa={handleUpdateCapa}
              onUploadComplete={handleUploadComplete}
              onOpenVideoModal={() => setShowVideoModal(true)}
              onMidiaTabChange={setMidiaTab}
              onDeleteMidia={handleDeleteMidia}
              isYouTubeUrl={isYouTubeUrl}
              getYouTubeThumbnail={getYouTubeThumbnail}
            />
        </div>
      )}

      {/* Modal Nova/Editar Galeria */}
      {showModal && editingGaleria && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-900 rounded-2xl p-6 w-full ${isMobile ? 'max-h-[90vh] overflow-y-auto' : 'max-w-md'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {editingGaleria.id ? 'Editar Galeria' : 'Nova Galeria'}
              </h3>
              <button
                onClick={() => { setShowModal(false); setEditingGaleria(null); }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome</label>
                <input
                  type="text"
                  value={editingGaleria.nome || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, nome: e.target.value })}
                  className={inputClass}
                  placeholder="Ex: Casamento Ana e Pedro"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Categoria</label>
                <div className="relative">
                  <select
                    value={editingGaleria.categoria || ''}
                    onChange={(e) => setEditingGaleria({ ...editingGaleria, categoria: e.target.value })}
                    className={inputClass + ' appearance-none cursor-pointer'}
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Descricao</label>
                <textarea
                  value={editingGaleria.descricao || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, descricao: e.target.value })}
                  className={inputClass}
                  rows={3}
                  placeholder="Breve descricao do projeto..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Video YouTube (opcional)</label>
                <input
                  type="text"
                  value={editingGaleria.video_url || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, video_url: e.target.value })}
                  className={inputClass}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Toggle Home */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Star className={`w-5 h-5 ${editingGaleria.is_principal ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} />
                    <div>
                      <p className="text-sm font-medium">Mostrar na Home</p>
                      <p className="text-xs text-gray-500">Secao Cases</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editingGaleria.is_principal || false}
                      disabled={!editingGaleria.is_principal && principaisCount >= MAX_PRINCIPAIS}
                      onChange={(e) => setEditingGaleria({ ...editingGaleria, is_principal: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      !editingGaleria.is_principal && principaisCount >= MAX_PRINCIPAIS 
                        ? 'bg-gray-700' 
                        : 'bg-gray-600 peer-checked:bg-amber-500'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        editingGaleria.is_principal ? 'translate-x-5' : ''
                      }`} />
                    </div>
                  </div>
                </label>
                {!editingGaleria.is_principal && principaisCount >= MAX_PRINCIPAIS && (
                  <p className="text-xs text-amber-400 mt-2 px-1">Limite de {MAX_PRINCIPAIS} atingido</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setEditingGaleria(null); }}
                disabled={saving}
                className="flex-1 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGaleria}
                disabled={saving}
                className="flex-1 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Categorias */}
      {showCategoriaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-900 rounded-2xl p-6 w-full ${isMobile ? 'max-h-[90vh] overflow-y-auto' : 'max-w-md'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Categorias</h3>
              <button onClick={() => setShowCategoriaModal(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="Nova categoria..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategoria()}
              />
              <button
                onClick={handleAddCategoria}
                disabled={!novaCategoria.trim()}
                className="px-4 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {categorias.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma categoria</p>
              ) : (
                categorias.map(cat => {
                  const count = galerias.filter(g => g.categoria === cat.nome).length;
                  return (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm">{cat.nome}</p>
                        <p className="text-xs text-gray-500">{count} galeria{count !== 1 && 's'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategoria(cat.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowCategoriaModal(false)}
              className="w-full mt-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal Video */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-900 rounded-2xl p-6 w-full ${isMobile ? '' : 'max-w-md'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Adicionar Video</h3>
              <button onClick={() => { setShowVideoModal(false); setVideoUrl(''); }} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">URL do YouTube</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {videoUrl && isYouTubeUrl(videoUrl) && (
                <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden">
                  <img src={getYouTubeThumbnail(videoUrl) || ''} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowVideoModal(false); setVideoUrl(''); }}
                className="flex-1 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddVideo}
                disabled={!videoUrl.trim() || !isYouTubeUrl(videoUrl)}
                className="flex-1 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
