'use client';

import { Save, Check, AlertCircle } from 'lucide-react';

interface SaveBarProps {
  onSave: () => void;
  saving: boolean;
  hasChanges: boolean;
  message?: string;
  messageType?: 'success' | 'error';
}

export default function SaveBar({ onSave, saving, hasChanges, message, messageType }: SaveBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Indicador de alteracoes */}
        <div className="flex items-center gap-2">
          {hasChanges && !message && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Alteracoes nao salvas
            </span>
          )}
          
          {message && (
            <span className={`flex items-center gap-1.5 text-xs ${
              messageType === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {messageType === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message}
            </span>
          )}
        </div>

        {/* Botao Salvar */}
        <button
          onClick={onSave}
          disabled={saving || !hasChanges}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            hasChanges
              ? 'bg-white text-black hover:bg-gray-200 active:scale-95'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}

// Versao compacta para desktop (apenas botao)
export function SaveButton({ onSave, saving, hasChanges }: Omit<SaveBarProps, 'message' | 'messageType'>) {
  return (
    <button
      onClick={onSave}
      disabled={saving || !hasChanges}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
        hasChanges
          ? 'bg-white text-black hover:bg-gray-200'
          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
      }`}
    >
      {saving ? 'Salvando...' : 'Salvar Alteracoes'}
    </button>
  );
}

