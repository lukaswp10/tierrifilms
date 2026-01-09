'use client';

import { useState, useEffect } from 'react';
import { supabase, Equipe } from '@/lib/supabase';
import { CldUploadWidget } from 'next-cloudinary';

export default function AdminEquipe() {
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
    return <div className="text-center text-gray-400">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Equipe (CREW)</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie os membros da equipe</p>
        </div>
        <button
          onClick={() => {
            setEditingMembro({ nome: '', cargo: '', foto_url: '' });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200"
        >
          + Novo Membro
        </button>
      </div>

      {/* Grid de Membros */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {equipe.map((membro) => (
          <div
            key={membro.id}
            className="bg-gray-800 rounded-lg overflow-hidden group"
          >
            <div className="aspect-[3/4] relative">
              {membro.foto_url ? (
                <img
                  src={membro.foto_url}
                  alt={membro.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-4xl text-gray-500">
                  ??
                </div>
              )}
              
              {/* Overlay com botoes */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setEditingMembro(membro);
                    setShowModal(true);
                  }}
                  className="px-3 py-1 bg-white text-black text-sm rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteMembro(membro.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
            
            <div className="p-3">
              <p className="font-medium">{membro.nome}</p>
              <p className="text-sm text-gray-400">{membro.cargo}</p>
            </div>
          </div>
        ))}
      </div>

      {equipe.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Nenhum membro cadastrado. Clique em "+ Novo Membro" para adicionar.
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        ?? Tamanho recomendado da foto: 400x500px (proporcao 3:4)
      </p>

      {/* Modal de Edicao */}
      {showModal && editingMembro && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingMembro.id ? 'Editar Membro' : 'Novo Membro'}
            </h3>

            <div className="space-y-4">
              {/* Foto */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-40 bg-gray-800 rounded-lg overflow-hidden mb-3">
                  {editingMembro.foto_url ? (
                    <img
                      src={editingMembro.foto_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                      ??
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
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      {editingMembro.foto_url ? 'Trocar Foto' : 'Adicionar Foto'}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={editingMembro.nome || ''}
                  onChange={(e) => setEditingMembro({ ...editingMembro, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Cargo</label>
                <input
                  type="text"
                  value={editingMembro.cargo || ''}
                  onChange={(e) => setEditingMembro({ ...editingMembro, cargo: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  placeholder="Ex: Diretor, Cinegrafista, Editor..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Ordem</label>
                <input
                  type="number"
                  value={editingMembro.ordem || 1}
                  onChange={(e) => setEditingMembro({ ...editingMembro, ordem: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  min={1}
                />
                <p className="text-xs text-gray-500 mt-1">Numero menor aparece primeiro</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingMembro(null);
                }}
                className="flex-1 py-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMembro}
                disabled={saving || !editingMembro.nome}
                className="flex-1 py-2 bg-white text-black font-medium rounded hover:bg-gray-200 disabled:opacity-50"
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

