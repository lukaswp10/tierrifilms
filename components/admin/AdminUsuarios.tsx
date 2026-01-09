'use client';

import { useState, useEffect } from 'react';
import { supabase, Usuario } from '@/lib/supabase';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({ email: '', nome: '', senha: '', role: 'editor' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    const { data } = await supabase
      .from('usuarios')
      .select('id, email, nome, role, created_at')
      .order('created_at', { ascending: true });
    
    if (data) setUsuarios(data as Usuario[]);
    setLoading(false);
  };

  const handleCreateUsuario = async () => {
    if (!novoUsuario.email || !novoUsuario.nome || !novoUsuario.senha) {
      setMessage('Preencha todos os campos');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Erro ao criar usuario');
        return;
      }

      setShowModal(false);
      setNovoUsuario({ email: '', nome: '', senha: '', role: 'editor' });
      loadUsuarios();
    } catch (error) {
      setMessage('Erro de conexao');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUsuario = async (id: string, email: string) => {
    if (email === 'admin@tierrifilms.com.br') {
      alert('O usuario admin principal nao pode ser excluido');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o usuario ${email}?`)) {
      await supabase.from('usuarios').delete().eq('id', id);
      loadUsuarios();
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Usuarios</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie os usuarios do painel admin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200"
        >
          + Novo Usuario
        </button>
      </div>

      {/* Lista de Usuarios */}
      <div className="space-y-3">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
          >
            <div>
              <p className="font-medium">{usuario.nome}</p>
              <p className="text-sm text-gray-400">{usuario.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 text-xs rounded ${
                usuario.role === 'admin' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {usuario.role === 'admin' ? 'Administrador' : 'Editor'}
              </span>
              {usuario.email !== 'admin@tierrifilms.com.br' && (
                <button
                  onClick={() => handleDeleteUsuario(usuario.id, usuario.email)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">?? Tipos de usuario:</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li><span className="text-purple-400">Administrador:</span> Pode criar/excluir usuarios e acessar todas as funcoes</li>
          <li><span className="text-blue-400">Editor:</span> Pode editar conteudo (pagina inicial, galerias, equipe)</li>
        </ul>
      </div>

      {/* Modal de Novo Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Novo Usuario</h3>

            {message && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Senha</label>
                <input
                  type="password"
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                  placeholder="Minimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                <select
                  value={novoUsuario.role}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNovoUsuario({ email: '', nome: '', senha: '', role: 'editor' });
                  setMessage('');
                }}
                className="flex-1 py-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUsuario}
                disabled={saving}
                className="flex-1 py-2 bg-white text-black font-medium rounded hover:bg-gray-200 disabled:opacity-50"
              >
                {saving ? 'Criando...' : 'Criar Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

