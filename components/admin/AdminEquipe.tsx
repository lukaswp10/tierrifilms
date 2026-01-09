'use client';

import { useState, useEffect } from 'react';
import { supabase, Equipe } from '@/lib/supabase';
import { CldUploadWidget } from 'next-cloudinary';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { Plus, Edit2, Trash2, X, User } from 'lucide-react';

export default function AdminEquipe() {
  const { isMobile } = useMediaQuery();
  const [equipe, setEquipe] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMembro, setEditingMembro] = useState<Partial<Equipe> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEquipe();
  }, []);

  const loadEquipe = async () => {
    const { data } = await supabase
      .from('equipe')
      .select('*')
      .order('ordem', { ascending: true });
    
    if (data) setEquipe(data);
    setLoading(false);
  };

  const handleSaveMembro = async () => {
    if (!editingMembro?.nome) return;
    setSaving(true);

    if (editingMembro.id) {
      await supabase
        .from('equipe')
        .update(editingMembro)
        .eq('id', editingMembro.id);
    } else {
      await supabase
        .from('equipe')
        .insert([{ ...editingMembro, ordem: equipe.length + 1 }]);
    }

    setShowModal(false);
    setEditingMembro(null);
    setSaving(false);
    loadEquipe();
  };

  const handleDeleteMembro = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este membro?')) {
      await supabase.from('equipe').delete().eq('id', id);
      loadEquipe();
    }
  };

  const handleUploadFoto = (url: string) => {
    setEditingMembro(prev => prev ? { ...prev, foto_url: url } : null);
  };

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Equipe</h2>
          <p className="text-gray-400 text-sm mt-1">Membros que aparecem na secao CREW</p>
        </div>
        <button
          onClick={() => {
            setEditingMembro({ nome: '', cargo: '', foto_url: '' });
            setShowModal(true);
          }}
          className={buttonPrimary}
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {isMobile ? 'Novo' : 'Novo Membro'}
          </span>
        </button>
      </div>

      {/* Grid de Membros */}
      {equipe.length > 0 ? (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {equipe.map((membro) => (
            <div
              key={membro.id}
              className="bg-gray-800/50 rounded-2xl overflow-hidden group"
            >
              <div className="aspect-[3/4] relative">
                {membro.foto_url ? (
                  <img
                    src={membro.foto_url}
                    alt={membro.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                
                {/* Overlay com botoes */}
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity ${
                  isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <button
                    onClick={() => {
                      setEditingMembro(membro);
                      setShowModal(true);
                    }}
                    className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMembro(membro.id)}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <p className="font-medium truncate">{membro.nome}</p>
                <p className="text-sm text-gray-400 truncate">{membro.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
          <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum membro cadastrado</p>
          <p className="text-gray-600 text-sm mt-1">Clique em &quot;Novo Membro&quot; para adicionar</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        Tamanho recomendado da foto: 400x500px (proporcao 3:4)
      </p>

      {/* Modal de Edicao - Fullscreen em mobile */}
      {showModal && editingMembro && (
        <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 ${isMobile ? '' : 'p-4'}`}>
          <div className={`bg-gray-900 w-full ${
            isMobile 
              ? 'h-full overflow-y-auto' 
              : 'max-w-md rounded-2xl'
          } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {editingMembro.id ? 'Editar Membro' : 'Novo Membro'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingMembro(null);
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Foto */}
              <div className="flex flex-col items-center">
                <div className="w-36 h-48 bg-gray-800 rounded-xl overflow-hidden mb-4">
                  {editingMembro.foto_url ? (
                    <img
                      src={editingMembro.foto_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <CldUploadWidget
                  uploadPreset="tierrifilms"
                  options={{ folder: 'tierrifilms/equipe' }}
                  onSuccess={(result: unknown) => {
                    const r = result as { info: { secure_url: string } };
                    handleUploadFoto(r.info.secure_url);
                  }}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {editingMembro.foto_url ? 'Trocar Foto' : 'Adicionar Foto'}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome</label>
                <input
                  type="text"
                  value={editingMembro.nome || ''}
                  onChange={(e) => setEditingMembro({ ...editingMembro, nome: e.target.value })}
                  className={inputClass}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Cargo</label>
                <input
                  type="text"
                  value={editingMembro.cargo || ''}
                  onChange={(e) => setEditingMembro({ ...editingMembro, cargo: e.target.value })}
                  className={inputClass}
                  placeholder="Ex: Diretor, Cinegrafista, Editor..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Ordem de exibicao</label>
                <input
                  type="number"
                  value={editingMembro.ordem || 1}
                  onChange={(e) => setEditingMembro({ ...editingMembro, ordem: parseInt(e.target.value) })}
                  className={inputClass}
                  min={1}
                />
                <p className="text-xs text-gray-500 mt-2">Numero menor aparece primeiro</p>
              </div>
            </div>

            <div className={`flex gap-3 ${isMobile ? 'mt-8' : 'mt-6'}`}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingMembro(null);
                }}
                className={`flex-1 py-3 ${buttonSecondary}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMembro}
                disabled={saving || !editingMembro.nome}
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
