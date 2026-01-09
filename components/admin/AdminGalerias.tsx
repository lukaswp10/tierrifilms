'use client';

import { useState, useEffect } from 'react';
import { supabase, Galeria, GaleriaFoto } from '@/lib/supabase';
import { CldUploadWidget } from 'next-cloudinary';

export default function AdminGalerias() {
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGaleria, setSelectedGaleria] = useState<Galeria | null>(null);
  const [fotos, setFotos] = useState<GaleriaFoto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGaleria, setEditingGaleria] = useState<Partial<Galeria> | null>(null);

  useEffect(() => {
    loadGalerias();
  }, []);

  const loadGalerias = async () => {
    const { data } = await supabase
      .from('galerias')
      .select('*')
      .order('is_principal', { ascending: false })
      .order('ordem', { ascending: true });
    
    if (data) setGalerias(data);
    setLoading(false);
  };

  const loadFotos = async (galeriaId: string) => {
    const { data } = await supabase
      .from('galeria_fotos')
      .select('*')
      .eq('galeria_id', galeriaId)
      .order('ordem', { ascending: true });
    
    if (data) setFotos(data);
  };

  const handleSelectGaleria = async (galeria: Galeria) => {
    setSelectedGaleria(galeria);
    await loadFotos(galeria.id);
  };

  const handleSaveGaleria = async () => {
    if (!editingGaleria) return;

    const slug = editingGaleria.nome
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (editingGaleria.id) {
      await supabase
        .from('galerias')
        .update({ ...editingGaleria, slug })
        .eq('id', editingGaleria.id);
    } else {
      await supabase
        .from('galerias')
        .insert([{ ...editingGaleria, slug, is_principal: false, ordem: galerias.length + 1 }]);
    }

    setShowModal(false);
    setEditingGaleria(null);
    loadGalerias();
  };

  const handleDeleteGaleria = async (id: string, isPrincipal: boolean) => {
    if (isPrincipal) {
      alert('Galerias principais nao podem ser excluidas');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta galeria?')) {
      await supabase.from('galerias').delete().eq('id', id);
      loadGalerias();
      if (selectedGaleria?.id === id) {
        setSelectedGaleria(null);
        setFotos([]);
      }
    }
  };

  const handleUploadComplete = async (result: { info?: { secure_url?: string } }) => {
    if (!selectedGaleria || !result.info?.secure_url) return;
    
    await supabase.from('galeria_fotos').insert([{
      galeria_id: selectedGaleria.id,
      foto_url: result.info.secure_url,
      ordem: fotos.length + 1,
    }]);
    
    loadFotos(selectedGaleria.id);
  };

  const handleDeleteFoto = async (fotoId: string) => {
    if (confirm('Excluir esta foto?')) {
      await supabase.from('galeria_fotos').delete().eq('id', fotoId);
      if (selectedGaleria) loadFotos(selectedGaleria.id);
    }
  };

  const handleUpdateCapa = async (url: string) => {
    if (!selectedGaleria) return;
    
    await supabase
      .from('galerias')
      .update({ capa_url: url })
      .eq('id', selectedGaleria.id);
    
    loadGalerias();
    setSelectedGaleria({ ...selectedGaleria, capa_url: url });
  };

  if (loading) {
    return <div className="text-center text-gray-400">Carregando...</div>;
  }

  return (
    <div className="flex gap-6 h-[600px]">
      <div className="w-1/3 border-r border-gray-800 pr-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Galerias</h2>
          <button
            onClick={() => {
              setEditingGaleria({ nome: '', categoria: '', descricao: '' });
              setShowModal(true);
            }}
            className="px-3 py-1 bg-white text-black text-sm font-medium rounded hover:bg-gray-200"
          >
            + Nova
          </button>
        </div>

        <div className="space-y-2">
          {galerias.map((galeria) => (
            <div
              key={galeria.id}
              onClick={() => handleSelectGaleria(galeria)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedGaleria?.id === galeria.id
                  ? 'bg-white text-black'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    {galeria.is_principal && '* '}
                    {galeria.nome}
                  </p>
                  <p className={`text-xs ${selectedGaleria?.id === galeria.id ? 'text-gray-600' : 'text-gray-500'}`}>
                    {galeria.categoria}
                  </p>
                </div>
                {!galeria.is_principal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGaleria(galeria.id, galeria.is_principal);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * = Galerias principais (aparecem na home)
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedGaleria ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedGaleria.nome}</h3>
                <p className="text-sm text-gray-400">{selectedGaleria.categoria}</p>
              </div>
              <button
                onClick={() => {
                  setEditingGaleria(selectedGaleria);
                  setShowModal(true);
                }}
                className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
              >
                Editar Info
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Imagem de Capa</p>
              <div className="flex items-center gap-4">
                {selectedGaleria.capa_url ? (
                  <img
                    src={selectedGaleria.capa_url}
                    alt="Capa"
                    className="w-32 h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-24 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-xs">
                    Sem capa
                  </div>
                )}
                <CldUploadWidget
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
                      className="px-3 py-2 bg-gray-800 text-sm rounded hover:bg-gray-700"
                    >
                      {selectedGaleria.capa_url ? 'Trocar Capa' : 'Adicionar Capa'}
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">Fotos ({fotos.length})</p>
                <CldUploadWidget
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
                    <button
                      onClick={() => open()}
                      className="px-3 py-1 bg-white text-black text-sm font-medium rounded hover:bg-gray-200"
                    >
                      + Adicionar Fotos
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {fotos.map((foto) => (
                  <div key={foto.id} className="relative group">
                    <img
                      src={foto.foto_url}
                      alt=""
                      className="w-full aspect-square object-cover rounded"
                    />
                    <button
                      onClick={() => handleDeleteFoto(foto.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>

              {fotos.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma foto ainda. Clique em + Adicionar Fotos para comecar.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecione uma galeria para editar
          </div>
        )}
      </div>

      {showModal && editingGaleria && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingGaleria.id ? 'Editar Galeria' : 'Nova Galeria'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={editingGaleria.nome || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  placeholder="Ex: Casamento Ana e Pedro"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Categoria</label>
                <select
                  value={editingGaleria.categoria || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, categoria: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
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
                <label className="block text-sm text-gray-400 mb-1">Descricao</label>
                <textarea
                  value={editingGaleria.descricao || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, descricao: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  rows={3}
                  placeholder="Breve descricao do projeto..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Video YouTube (opcional)</label>
                <input
                  type="text"
                  value={editingGaleria.video_url || ''}
                  onChange={(e) => setEditingGaleria({ ...editingGaleria, video_url: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingGaleria(null);
                }}
                className="flex-1 py-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGaleria}
                className="flex-1 py-2 bg-white text-black font-medium rounded hover:bg-gray-200"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

