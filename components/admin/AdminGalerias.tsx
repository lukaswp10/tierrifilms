'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Galeria, GaleriaFoto } from '@/lib/supabase';
import { CldUploadWidget } from 'next-cloudinary';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { ChevronLeft, Plus, Image, Trash2, Edit2, X, Star } from 'lucide-react';

type MobileView = 'list' | 'details';

export default function AdminGalerias() {
  const { isMobile } = useMediaQuery();
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGaleria, setSelectedGaleria] = useState<Galeria | null>(null);
  const [fotos, setFotos] = useState<GaleriaFoto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGaleria, setEditingGaleria] = useState<Partial<Galeria> | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('list');
  
  // useRef para evitar closure stale nos callbacks do CldUploadWidget
  const selectedGaleriaRef = useRef<Galeria | null>(null);
  const fotosRef = useRef<GaleriaFoto[]>([]);

  // Mantem refs sincronizadas com state
  useEffect(() => {
    selectedGaleriaRef.current = selectedGaleria;
  }, [selectedGaleria]);

  useEffect(() => {
    fotosRef.current = fotos;
  }, [fotos]);

  useEffect(() => {
    loadGalerias();
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

  const loadFotos = async (galeriaId: string) => {
    try {
      const res = await fetch(`/api/admin/galerias/fotos?galeria_id=${galeriaId}`);
      if (res.ok) {
        const data = await res.json();
        setFotos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    }
  };

  const handleSelectGaleria = async (galeria: Galeria) => {
    setSelectedGaleria(galeria);
    await loadFotos(galeria.id);
    if (isMobile) {
      setMobileView('details');
    }
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedGaleria(null);
    setFotos([]);
  };

  const handleSaveGaleria = async () => {
    if (!editingGaleria) return;
    setSaving(true);

    try {
      let response;
      
      if (editingGaleria.id) {
        // Atualizar
        response = await fetch('/api/admin/galerias', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingGaleria),
        });
      } else {
        // Criar
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
    } catch (error) {
      console.error('Erro ao salvar galeria:', error);
      alert('Erro ao salvar galeria');
    }
    setSaving(false);
  };

  const handleDeleteGaleria = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta galeria?')) {
      try {
        await fetch(`/api/admin/galerias?id=${id}`, { method: 'DELETE' });
        await loadGalerias();
        if (selectedGaleria?.id === id) {
          setSelectedGaleria(null);
          setFotos([]);
          if (isMobile) setMobileView('list');
        }
      } catch (error) {
        console.error('Erro ao deletar galeria:', error);
      }
    }
  };

  // Callback para upload de fotos - usa ref para evitar closure stale
  const handleUploadComplete = useCallback(async (result: { info?: { secure_url?: string } }) => {
    const currentGaleria = selectedGaleriaRef.current;
    const currentFotos = fotosRef.current;
    
    if (!currentGaleria || !result.info?.secure_url) return;
    
    try {
      await fetch('/api/admin/galerias/fotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          galeria_id: currentGaleria.id,
          foto_url: result.info.secure_url,
          ordem: currentFotos.length + 1,
        }),
      });
      
      // Recarrega fotos da galeria atual
      await loadFotos(currentGaleria.id);
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
    }
  }, []);

  const handleDeleteFoto = async (fotoId: string) => {
    if (confirm('Excluir esta foto?')) {
      try {
        await fetch(`/api/admin/galerias/fotos?id=${fotoId}`, { method: 'DELETE' });
        if (selectedGaleria) await loadFotos(selectedGaleria.id);
      } catch (error) {
        console.error('Erro ao deletar foto:', error);
      }
    }
  };

  // Callback para atualizar capa - usa ref para evitar closure stale
  const handleUpdateCapa = useCallback(async (url: string) => {
    const currentGaleria = selectedGaleriaRef.current;
    if (!currentGaleria) return;
    
    try {
      await fetch('/api/admin/galerias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentGaleria.id,
          capa_url: url,
        }),
      });
      
      // Atualiza o state local
      setSelectedGaleria(prev => prev ? { ...prev, capa_url: url } : null);
      await loadGalerias();
    } catch (error) {
      console.error('Erro ao atualizar capa:', error);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  // Estilos comuns
  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all";
  const buttonPrimary = "px-4 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors";
  const buttonSecondary = "px-4 py-2.5 bg-gray-800 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors";

  // ==================== COMPONENTES INTERNOS ====================

  // Conta quantas galerias sao principais
  const principaisCount = galerias.filter(g => g.is_principal).length;
  const MAX_PRINCIPAIS = 6;

  // Lista de Galerias
  const GaleriasList = () => (
    <div className={isMobile ? '' : 'w-1/3 border-r border-gray-800 pr-6'}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Galerias</h2>
          <p className={`text-xs mt-1 ${principaisCount >= MAX_PRINCIPAIS ? 'text-amber-400' : 'text-green-400'}`}>
            <Star className="w-3 h-3 inline mr-1" />
            {principaisCount}/{MAX_PRINCIPAIS} na Home
          </p>
        </div>
        <button
          onClick={() => {
            setEditingGaleria({ nome: '', categoria: '', descricao: '' });
            setShowModal(true);
          }}
          className={buttonPrimary}
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {isMobile ? 'Nova' : 'Nova Galeria'}
          </span>
        </button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {galerias.map((galeria) => (
          <div
            key={galeria.id}
            onClick={() => handleSelectGaleria(galeria)}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              selectedGaleria?.id === galeria.id && !isMobile
                ? 'bg-white text-black'
                : 'bg-gray-800/50 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                {galeria.capa_url ? (
                  <img src={galeria.capa_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate flex items-center gap-1.5">
                  {galeria.is_principal && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                  <span className="truncate">{galeria.nome}</span>
                </p>
                <p className={`text-xs truncate ${
                  selectedGaleria?.id === galeria.id && !isMobile ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {galeria.categoria}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGaleria(galeria.id);
                }}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> = Aparece na pagina inicial
      </p>
    </div>
  );

  // Detalhes da Galeria
  const GaleriaDetails = () => (
    <div className={isMobile ? '' : 'flex-1 pl-6'}>
      {selectedGaleria ? (
        <div>
          {/* Header com botao voltar em mobile */}
          {isMobile && (
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 -ml-1"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Voltar</span>
            </button>
          )}

          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">{selectedGaleria.nome}</h3>
              <p className="text-sm text-gray-400 mt-1">{selectedGaleria.categoria}</p>
              {selectedGaleria.descricao && (
                <p className="text-sm text-gray-500 mt-2">{selectedGaleria.descricao}</p>
              )}
            </div>
            <button
              onClick={() => {
                setEditingGaleria(selectedGaleria);
                setShowModal(true);
              }}
              className={buttonSecondary}
            >
              <span className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Editar
              </span>
            </button>
          </div>

          {/* Imagem de Capa */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Imagem de Capa</h4>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-full sm:w-48 h-32 bg-gray-800 rounded-xl overflow-hidden">
                {selectedGaleria.capa_url ? (
                  <img
                    src={selectedGaleria.capa_url}
                    alt="Capa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Image className="w-8 h-8" />
                  </div>
                )}
              </div>
              {/* key forca re-render quando galeria muda, evitando closure stale */}
              <CldUploadWidget
                key={`capa-${selectedGaleria.id}`}
                uploadPreset="tierrifilms"
                options={{ folder: 'tierrifilms/capas' }}
                onSuccess={(result) => {
                  const r = result as { info?: { secure_url?: string } };
                  if (r.info?.secure_url) handleUpdateCapa(r.info.secure_url);
                }}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    className={buttonSecondary}
                  >
                    {selectedGaleria.capa_url ? 'Trocar Capa' : 'Adicionar Capa'}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* Fotos da Galeria */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-400">
                Fotos <span className="text-gray-600">({fotos.length})</span>
              </h4>
              {/* key forca re-render quando galeria muda */}
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
                  handleUploadComplete(r);
                }}
              >
                {({ open }) => (
                  <button onClick={() => open()} className={buttonPrimary}>
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar Fotos
                    </span>
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {fotos.length > 0 ? (
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-3 lg:grid-cols-4'}`}>
                {fotos.map((foto) => (
                  <div key={foto.id} className="relative group aspect-square">
                    <img
                      src={foto.foto_url}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => handleDeleteFoto(foto.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
                <Image className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma foto ainda</p>
                <p className="text-gray-600 text-sm mt-1">Clique em &quot;Adicionar Fotos&quot; para comecar</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <Image className="w-12 h-12 mb-4 text-gray-600" />
          <p>Selecione uma galeria para editar</p>
        </div>
      )}
    </div>
  );

  // ==================== RENDER ====================

  return (
    <div>
      {/* Layout Mobile */}
      {isMobile ? (
        <div>
          {mobileView === 'list' ? <GaleriasList /> : <GaleriaDetails />}
        </div>
      ) : (
        // Layout Desktop
        <div className="flex gap-6 min-h-[600px]">
          <GaleriasList />
          <GaleriaDetails />
        </div>
      )}

      {/* Modal de Edicao */}
      {showModal && editingGaleria && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-900 rounded-2xl p-6 w-full ${isMobile ? 'max-h-[90vh] overflow-y-auto' : 'max-w-md'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {editingGaleria.id ? 'Editar Galeria' : 'Nova Galeria'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingGaleria(null);
                }}
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
                <select
                  value={editingGaleria.categoria || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, categoria: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Selecione...</option>
                  <option value="Casamento">Casamento</option>
                  <option value="Evento">Evento</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Festa">Festa</option>
                  <option value="Outro">Outro</option>
                </select>
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

              {/* Toggle Mostrar na Home */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Star className={`w-5 h-5 ${editingGaleria.is_principal ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} />
                    <div>
                      <p className="text-sm font-medium">Mostrar na Pagina Inicial</p>
                      <p className="text-xs text-gray-500">Aparece na secao Cases da home</p>
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
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-gray-600 peer-checked:bg-amber-500 group-hover:bg-gray-500'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        editingGaleria.is_principal ? 'translate-x-5' : ''
                      }`} />
                    </div>
                  </div>
                </label>
                {!editingGaleria.is_principal && principaisCount >= MAX_PRINCIPAIS && (
                  <p className="text-xs text-amber-400 mt-2 px-1">
                    Limite de {MAX_PRINCIPAIS} galerias na home atingido. Desmarque outra para adicionar esta.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingGaleria(null);
                }}
                disabled={saving}
                className={`flex-1 py-3 ${buttonSecondary}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGaleria}
                disabled={saving}
                className={`flex-1 py-3 ${buttonPrimary} disabled:opacity-50`}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
