'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Images, Users, Settings } from 'lucide-react';
import { LogoText } from '@/components/Logo';
import { SessionUser } from '@/lib/auth';
import AdminHome from './AdminHome';
import AdminGalerias from './AdminGalerias';
import AdminEquipe from './AdminEquipe';
import AdminUsuarios from './AdminUsuarios';

interface AdminDashboardProps {
  user: SessionUser;
}

type Tab = 'home' | 'galerias' | 'equipe' | 'usuarios';

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  const tabs = [
    { id: 'home' as Tab, label: 'Pagina Inicial', icon: <Home className="w-4 h-4" /> },
    { id: 'galerias' as Tab, label: 'Galerias', icon: <Images className="w-4 h-4" /> },
    { id: 'equipe' as Tab, label: 'Equipe', icon: <Users className="w-4 h-4" /> },
    ...(user.role === 'admin' ? [{ id: 'usuarios' as Tab, label: 'Usuarios', icon: <Settings className="w-4 h-4" /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <LogoText size="sm" />
              <span className="text-gray-500 text-sm">Admin</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Ola, <span className="text-white">{user.nome}</span>
              </span>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-xl p-6 min-h-[500px]">
          {activeTab === 'home' && <AdminHome />}
          {activeTab === 'galerias' && <AdminGalerias />}
          {activeTab === 'equipe' && <AdminEquipe />}
          {activeTab === 'usuarios' && user.role === 'admin' && <AdminUsuarios />}
        </div>
      </div>
    </div>
  );
}
