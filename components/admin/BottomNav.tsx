'use client';

import { Home, Images, Users, MoreHorizontal, X, Key, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export type Tab = 'home' | 'galerias' | 'clientes' | 'equipe' | 'parceiros' | 'usuarios' | 'recursos';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isAdmin: boolean;
  onLogout: () => void;
  onChangePassword?: () => void;
}

export default function BottomNav({ activeTab, onTabChange, isAdmin, onLogout, onChangePassword }: BottomNavProps) {
  const [showMore, setShowMore] = useState(false);

  const mainTabs = [
    { id: 'home' as Tab, label: 'Site', icon: Home },
    { id: 'galerias' as Tab, label: 'Galerias', icon: Images },
    { id: 'clientes' as Tab, label: 'Clientes', icon: MessageCircle },
  ];

  const moreTabs = [
    { id: 'equipe' as Tab, label: 'Equipe' },
    { id: 'parceiros' as Tab, label: 'Parceiros' },
    { id: 'recursos' as Tab, label: 'Uso do Sistema' },
    ...(isAdmin ? [{ id: 'usuarios' as Tab, label: 'Usuarios' }] : []),
  ];

  const handleMoreTab = (tab: Tab) => {
    onTabChange(tab);
    setShowMore(false);
  };

  return (
    <>
      {/* Overlay do menu "Mais" */}
      {showMore && (
        <div 
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* Menu "Mais" expandido */}
      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 rounded-t-2xl p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-400">Mais opcoes</span>
            <button 
              onClick={() => setShowMore(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-1">
            {moreTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleMoreTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            <div className="border-t border-gray-800 mt-3 pt-3 space-y-1">
              {onChangePassword && (
                <button
                  onClick={() => {
                    onChangePassword();
                    setShowMore(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Alterar Senha
                </button>
              )}
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Sair do Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-2' : ''}`} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
          
          {/* Botao "Mais" */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              showMore || ['equipe', 'parceiros', 'recursos', 'usuarios'].includes(activeTab)
                ? 'text-white'
                : 'text-gray-500'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </div>
      </nav>

      {/* Espacador para compensar a bottom nav */}
      <div className="h-16" />
    </>
  );
}

