'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useMediaQuery } from '@/lib/useMediaQuery';

interface Parceiro {
  id: string;
  nome: string;
  logo_url?: string;
  ordem: number;
}

export default function AdminParceiros() {
  const { isMobile } = useMediaQuery();
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [novoNome, setNovoNome] = useState('');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadParceiros();
  }, []);

  const loadParceiros = async () => {
    try {
      const res = await fetch('/api/admin/parceiros');
      if (res.ok) {
        const data = await res.json();
        setParceiros(data);
      }
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
    }
    setLoading(false);
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAdd = async () => {
    if (!novoNome.trim()) {
      showMessage('Digite o nome do parceiro', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/parceiros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoNome.trim(),
          ordem: parceiros.length + 1
        })
      });

      if (res.ok) {
        const novoParceiro = await res.json();
        setParceiros([...parceiros, novoParceiro]);
        setNovoNome('');
        showMessage('Parceiro adicionado!', 'success');
      } else {
        showMessage('Erro ao adicionar', 'error');
      }
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      showMessage('Erro ao adicionar', 'error');
    }
    setSaving(false);
  };

  const handleUpdate = async (id: string, updates: Partial<Parceiro>) => {
    try {
      const res = await fetch('/api/admin/parceiros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });

      if (res.ok) {
        setParceiros(parceiros.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este parceiro?')) return;

    try {
      const res = await fetch(`/api/admin/parceiros?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setParceiros(parceiros.filter(p => p.id !== id));
        showMessage('Parceiro removido', 'success');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const handleLogoUpload = async (parceiroId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      showMessage('Selecione uma imagem', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage('Imagem muito grande (max 2MB)', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'parceiros');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.url) {
        await handleUpdate(parceiroId, { logo_url: data.url });
        showMessage('Logo enviado!', 'success');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      showMessage('Erro ao enviar logo', 'error');
    }
  };

  const handleRemoveLogo = async (parceiroId: string) => {
    await handleUpdate(parceiroId, { logo_url: undefined });
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= parceiros.length) return;

    const newParceiros = [...parceiros];
    [newParceiros[index], newParceiros[newIndex]] = [newParceiros[newIndex], newParceiros[index]];
    
    // Atualizar ordem
    const updated = newParceiros.map((p, i) => ({ ...p, ordem: i + 1 }));
    setParceiros(updated);

    // Salvar no banco
    for (const p of updated) {
      await handleUpdate(p.id, { ordem: p.ordem });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  // Estilos
  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Parceiros</h2>
          <p className="text-gray-400 text-sm mt-1">Clientes e parceiros exibidos no site</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${
          messageType === 'success' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {message}
        </div>
      )}

      {/* Adicionar novo */}
      <div className={`flex gap-3 mb-6 ${isMobile ? 'flex-col' : ''}`}>
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nome do parceiro"
          className={`${inputClass} ${isMobile ? '' : 'flex-1'}`}
        />
        <button
          onClick={handleAdd}
          disabled={saving || !novoNome.trim()}
          className={`px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
            isMobile ? 'w-full' : ''
          }`}
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Lista de parceiros */}
      <div className="space-y-3">
        {parceiros.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
            <p className="text-gray-500">Nenhum parceiro cadastrado</p>
          </div>
        ) : (
          parceiros.map((parceiro, index) => (
            <div
              key={parceiro.id}
              className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-xl"
            >
              {/* Reordenar */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === parceiros.length - 1}
                  className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Logo */}
              <div className="relative w-16 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden group flex-shrink-0">
                {parceiro.logo_url ? (
                  <>
                    <Image
                      src={parceiro.logo_url}
                      alt={parceiro.nome}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                    <button
                      onClick={() => handleRemoveLogo(parceiro.id)}
                      className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRefs.current[parceiro.id]?.click()}
                    className="text-gray-500 hover:text-white transition-colors p-2"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => { fileInputRefs.current[parceiro.id] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(parceiro.id, file);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>

              {/* Nome editavel */}
              <input
                type="text"
                value={parceiro.nome}
                onChange={(e) => {
                  const newNome = e.target.value;
                  setParceiros(parceiros.map(p =>
                    p.id === parceiro.id ? { ...p, nome: newNome } : p
                  ));
                }}
                onBlur={(e) => handleUpdate(parceiro.id, { nome: e.target.value })}
                className="flex-1 px-3 py-2 bg-transparent border border-transparent hover:border-gray-600 focus:border-gray-500 rounded-lg text-white focus:outline-none min-w-0"
              />

              {/* Deletar */}
              <button
                onClick={() => handleDelete(parceiro.id)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Dica */}
      <p className="text-gray-500 text-xs mt-6">
        Clique no icone de upload para adicionar um logo. Se nao houver logo, o nome sera exibido.
      </p>
    </div>
  );
}
