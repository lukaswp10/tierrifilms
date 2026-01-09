'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Images, Users, BarChart3, Building2, Settings, LogOut, ExternalLink, Key, ChevronDown, MessageCircle } from 'lucide-react';
import { LogoText } from '@/components/Logo';
import { SessionUser } from '@/lib/auth';
import { useMediaQuery } from '@/lib/useMediaQuery';
import BottomNav, { Tab } from './BottomNav';
import AdminHome from './AdminHome';
import AdminGalerias from './AdminGalerias';
import AdminEquipe from './AdminEquipe';
import AdminParceiros from './AdminParceiros';
import AdminUsuarios from './AdminUsuarios';
import AdminUsage from './AdminUsage';
import AdminClientes from './AdminClientes';
import ChangePasswordModal from './ChangePasswordModal';

interface AdminDashboardProps {
  user: SessionUser;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar contagem de follow-ups pendentes
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await fetch('/api/admin/leads');
        if (res.ok) {
          const data = await res.json();
          setFollowUpCount(data.metricas?.followUpsPendentes || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar follow-ups:', error);
      }
    };
    
    fetchFollowUps();
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchFollowUps, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  // Tabs para desktop sidebar
  const desktopTabs = [
    { id: 'home' as Tab, label: 'Site', icon: Home, description: 'Conteudo da pagina inicial' },
    { id: 'galerias' as Tab, label: 'Galerias', icon: Images, description: 'Portfolio de trabalhos' },
    { id: 'clientes' as Tab, label: 'Clientes', icon: MessageCircle, description: 'Leads do formulario' },
    { id: 'equipe' as Tab, label: 'Equipe', icon: Users, description: 'Membros da equipe' },
    { id: 'parceiros' as Tab, label: 'Parceiros', icon: Building2, description: 'Clientes e parceiros' },
    { id: 'recursos' as Tab, label: 'Uso do Sistema', icon: BarChart3, description: 'Estatisticas de uso' },
    ...(user.role === 'admin' 
      ? [{ id: 'usuarios' as Tab, label: 'Usuarios', icon: Settings, description: 'Gerenciar acessos' }] 
      : []
    ),
  ];

  // Renderiza conteudo baseado na tab ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AdminHome />;
      case 'galerias':
        return <AdminGalerias />;
      case 'clientes':
        return <AdminClientes />;
      case 'equipe':
        return <AdminEquipe />;
      case 'parceiros':
        return <AdminParceiros />;
      case 'recursos':
        return <AdminUsage />;
      case 'usuarios':
        return user.role === 'admin' ? <AdminUsuarios /> : null;
      default:
        return <AdminHome />;
    }
  };

  // Layout Mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-950">
        {/* Header Mobile */}
        <header className="sticky top-0 z-50 bg-black border-b border-gray-800 safe-area-top">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <LogoText size="sm" />
              <span className="text-gray-600 text-xs">Admin</span>
            </div>
            
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
            >
              Ver site
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Conteudo */}
        <main className="admin-content">
          <div className="p-4">
            {renderContent()}
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAdmin={user.role === 'admin'}
          onLogout={handleLogout}
          onChangePassword={() => setShowChangePassword(true)}
          followUpCount={followUpCount}
        />

        {/* Modal Alterar Senha (Mobile) */}
        {showChangePassword && (
          <ChangePasswordModal
            mode="self"
            onClose={() => setShowChangePassword(false)}
            onSuccess={() => setShowChangePassword(false)}
          />
        )}
      </div>
    );
  }

  // Layout Desktop
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-black border-r border-gray-800 flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <LogoText size="sm" />
            <span className="text-gray-500 text-sm">Admin</span>
          </div>
        </div>

        {/* Navegacao */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {desktopTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{tab.label}</p>
                  {!isActive && (
                    <p className="text-xs text-gray-600 truncate">{tab.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Usuario e Menu */}
        <div className="p-4 border-t border-gray-800" ref={userMenuRef}>
          {/* Botao do usuario que abre dropdown */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-medium text-white truncate">{user.nome}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="mt-2 py-1 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Key className="w-4 h-4" />
                Alterar Senha
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Site
              </a>
              <div className="border-t border-gray-800 my-1" />
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                Sair do Painel
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Conteudo Principal Desktop */}
      <main className="flex-1 ml-64">
        {/* Header Desktop */}
        <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
          <div className="px-8 py-4">
            <h1 className="text-xl font-semibold text-white">
              {desktopTabs.find(t => t.id === activeTab)?.label || 'Site'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {desktopTabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>
        </header>

        {/* Area de conteudo */}
        <div className="p-8">
          <div className="bg-gray-900 rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Modal Alterar Senha */}
      {showChangePassword && (
        <ChangePasswordModal
          mode="self"
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
}
