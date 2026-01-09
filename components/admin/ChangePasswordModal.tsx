'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMediaQuery } from '@/lib/useMediaQuery';

interface ChangePasswordModalProps {
  mode: 'self' | 'reset';
  targetUser?: { id: string; nome: string; email: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangePasswordModal({ 
  mode, 
  targetUser, 
  onClose, 
  onSuccess 
}: ChangePasswordModalProps) {
  const { isMobile } = useMediaQuery();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSelfMode = mode === 'self';
  const title = isSelfMode ? 'Alterar Minha Senha' : `Resetar Senha`;

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validacoes
    if (isSelfMode && !senhaAtual) {
      setError('Digite sua senha atual');
      return;
    }

    if (!novaSenha) {
      setError('Digite a nova senha');
      return;
    }

    if (novaSenha.length < 6) {
      setError('A nova senha deve ter no minimo 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas nao conferem');
      return;
    }

    if (isSelfMode && senhaAtual === novaSenha) {
      setError('A nova senha deve ser diferente da atual');
      return;
    }

    setSaving(true);

    try {
      const body = isSelfMode 
        ? { senhaAtual, novaSenha }
        : { targetUserId: targetUser?.id, novaSenha, reset: true };

      const res = await fetch('/api/admin/usuarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao alterar senha');
        return;
      }

      setSuccess(isSelfMode ? 'Senha alterada com sucesso!' : 'Senha resetada com sucesso!');
      
      // Fecha modal apos 1.5s
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);

    } catch {
      setError('Erro de conexao');
    } finally {
      setSaving(false);
    }
  };

  // Estilos
  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all pr-12";
  const buttonPrimary = "px-4 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors";
  const buttonSecondary = "px-4 py-2.5 bg-gray-800 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors";

  return (
    <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 ${isMobile ? '' : 'p-4'}`}>
      <div className={`bg-gray-900 w-full ${
        isMobile 
          ? 'h-full overflow-y-auto' 
          : 'max-w-md rounded-2xl'
      } p-6`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {!isSelfMode && targetUser && (
                <p className="text-sm text-gray-500">{targetUser.nome}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 text-green-400 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Formulario */}
        <div className="space-y-4">
          {/* Senha Atual (apenas modo self) */}
          {isSelfMode && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Senha atual</label>
              <div className="relative">
                <input
                  type={showSenhaAtual ? 'text' : 'password'}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className={inputClass}
                  placeholder="Digite sua senha atual"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showSenhaAtual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Nova Senha */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nova senha</label>
            <div className="relative">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className={inputClass}
                placeholder="Minimo 6 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showNovaSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmar Nova Senha */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Confirmar nova senha</label>
            <div className="relative">
              <input
                type={showConfirmar ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={`${inputClass} ${
                  confirmarSenha && novaSenha !== confirmarSenha 
                    ? 'border-red-500' 
                    : confirmarSenha && novaSenha === confirmarSenha 
                      ? 'border-green-500' 
                      : ''
                }`}
                placeholder="Digite novamente"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showConfirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmarSenha && novaSenha !== confirmarSenha && (
              <p className="text-xs text-red-400 mt-1">As senhas nao conferem</p>
            )}
          </div>

          {/* Dica de seguranca */}
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <p className="text-xs text-gray-500">
              Dica: Use uma senha forte com letras, numeros e caracteres especiais.
            </p>
          </div>
        </div>

        {/* Botoes */}
        <div className={`flex gap-3 ${isMobile ? 'mt-8' : 'mt-6'}`}>
          <button
            onClick={onClose}
            disabled={saving}
            className={`flex-1 py-3 ${buttonSecondary}`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !!success}
            className={`flex-1 py-3 ${buttonPrimary} disabled:opacity-50`}
          >
            {saving ? 'Salvando...' : isSelfMode ? 'Alterar Senha' : 'Resetar Senha'}
          </button>
        </div>
      </div>
    </div>
  );
}

