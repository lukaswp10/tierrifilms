'use client';

import { useState, useEffect } from 'react';
import { supabase, Usuario } from '@/lib/supabase';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { Plus, Trash2, X, Shield, User, Key } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

export default function AdminUsuarios() {
  const { isMobile } = useMediaQuery();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({ email: '', nome: '', senha: '', role: 'editor' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [resetPasswordUser, setResetPasswordUser] = useState<{ id: string; nome: string; email: string } | null>(null);
  const [showMyPassword, setShowMyPassword] = useState(false);

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
    } catch {
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  // Estilos
  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all";
  const buttonPrimary = "px-4 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors";
  const buttonSecondary = "px-4 py-2.5 bg-gray-800 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Usuarios</h2>
          <p className="text-gray-400 text-sm mt-1">Pessoas com acesso ao painel admin</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMyPassword(true)}
            className={buttonSecondary}
          >
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              {isMobile ? 'Senha' : 'Minha Senha'}
            </span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className={buttonPrimary}
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {isMobile ? 'Novo' : 'Novo Usuario'}
            </span>
          </button>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="space-y-3">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                usuario.role === 'admin' ? 'bg-purple-500/20' : 'bg-blue-500/20'
              }`}>
                {usuario.role === 'admin' ? (
                  <Shield className="w-5 h-5 text-purple-400" />
                ) : (
                  <User className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{usuario.nome}</p>
                <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                usuario.role === 'admin' 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {usuario.role === 'admin' ? 'Admin' : 'Editor'}
              </span>
              {/* Resetar Senha - apenas para editores */}
              {usuario.role === 'editor' && (
                <button
                  onClick={() => setResetPasswordUser({ 
                    id: usuario.id, 
                    nome: usuario.nome, 
                    email: usuario.email 
                  })}
                  className="p-2 text-gray-500 hover:text-amber-400 transition-colors"
                  title="Resetar senha"
                >
                  <Key className="w-4 h-4" />
                </button>
              )}
              {/* Excluir - nao pode excluir admin principal */}
              {usuario.email !== 'admin@tierrifilms.com.br' && (
                <button
                  onClick={() => handleDeleteUsuario(usuario.id, usuario.email)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  title="Excluir usuario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-800">
        <p className="text-sm font-medium text-gray-400 mb-3">Tipos de usuario</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">Administrador</span>
            <span className="text-gray-500">- Acesso total ao sistema</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">Editor</span>
            <span className="text-gray-500">- Edita conteudo (sem gerenciar usuarios)</span>
          </div>
        </div>
      </div>

      {/* Modal de Novo Usuario - Fullscreen em mobile */}
      {showModal && (
        <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 ${isMobile ? '' : 'p-4'}`}>
          <div className={`bg-gray-900 w-full ${
            isMobile 
              ? 'h-full overflow-y-auto' 
              : 'max-w-md rounded-2xl'
          } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Novo Usuario</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNovoUsuario({ email: '', nome: '', senha: '', role: 'editor' });
                  setMessage('');
                }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-red-500/20 text-red-400 text-sm rounded-xl">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome</label>
                <input
                  type="text"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  className={inputClass}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  className={inputClass}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Senha</label>
                <input
                  type="password"
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                  className={inputClass}
                  placeholder="Minimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo de acesso</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNovoUsuario({ ...novoUsuario, role: 'editor' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      novoUsuario.role === 'editor'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${
                      novoUsuario.role === 'editor' ? 'text-blue-400' : 'text-gray-500'
                    }`} />
                    <p className="text-sm font-medium">Editor</p>
                    <p className="text-xs text-gray-500 mt-1">Edita conteudo</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovoUsuario({ ...novoUsuario, role: 'admin' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      novoUsuario.role === 'admin'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Shield className={`w-6 h-6 mx-auto mb-2 ${
                      novoUsuario.role === 'admin' ? 'text-purple-400' : 'text-gray-500'
                    }`} />
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs text-gray-500 mt-1">Acesso total</p>
                  </button>
                </div>
              </div>
            </div>

            <div className={`flex gap-3 ${isMobile ? 'mt-8' : 'mt-6'}`}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNovoUsuario({ email: '', nome: '', senha: '', role: 'editor' });
                  setMessage('');
                }}
                className={`flex-1 py-3 ${buttonSecondary}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUsuario}
                disabled={saving}
                className={`flex-1 py-3 ${buttonPrimary} disabled:opacity-50`}
              >
                {saving ? 'Criando...' : 'Criar Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resetar Senha */}
      {resetPasswordUser && (
        <ChangePasswordModal
          mode="reset"
          targetUser={resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
          onSuccess={() => setResetPasswordUser(null)}
        />
      )}

      {/* Modal de Alterar Minha Senha */}
      {showMyPassword && (
        <ChangePasswordModal
          mode="self"
          onClose={() => setShowMyPassword(false)}
          onSuccess={() => setShowMyPassword(false)}
        />
      )}
    </div>
  );
}
