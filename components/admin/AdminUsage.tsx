'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Cloud, Database, Globe, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

interface UsageData {
  cloudinary: {
    storage: { used: number; limit: number; usedFormatted: string; limitFormatted: string; percentage: number };
    bandwidth: { used: number; limit: number; usedFormatted: string; limitFormatted: string; percentage: number };
    credits: { used: number; limit: number; percentage: number };
    resources: number;
    plan: string;
    lastUpdated: string;
  } | null;
  supabase: {
    database: { used: number; limit: number; usedFormatted: string; limitFormatted: string; percentage: number };
    tables: { name: string; count: number }[];
    totalRecords: number;
  };
  vercel: {
    bandwidth: { limit: number; limitFormatted: string; note: string };
    buildMinutes: { limit: number; limitFormatted: string; note: string };
  };
  updatedAt: string;
}

// Calcular equivalencia em fotos/videos
function getEquivalent(bytes: number, type: 'storage' | 'bandwidth'): string {
  const mb = bytes / (1024 * 1024);
  const photos = Math.floor(mb / 5); // 5MB por foto
  const videos = Math.floor(mb / 500); // 500MB por video
  
  if (type === 'storage') {
    if (photos > 0 && videos > 0) {
      return `~${photos} fotos de 5MB ou ~${videos} videos`;
    }
    return photos > 0 ? `~${photos} fotos de 5MB` : '< 1 foto';
  }
  
  return `~${Math.floor(bytes / (1024 * 1024 * 10))} visitantes`;
}

// Cor baseada na porcentagem
function getStatusColor(percentage: number): { bg: string; text: string; bar: string; icon: React.ReactNode } {
  if (percentage < 70) {
    return { 
      bg: 'bg-green-500/10', 
      text: 'text-green-400', 
      bar: 'bg-green-500',
      icon: <CheckCircle className="w-5 h-5 text-green-400" />
    };
  }
  if (percentage < 90) {
    return { 
      bg: 'bg-yellow-500/10', 
      text: 'text-yellow-400', 
      bar: 'bg-yellow-500',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />
    };
  }
  return { 
    bg: 'bg-red-500/10', 
    text: 'text-red-400', 
    bar: 'bg-red-500',
    icon: <AlertTriangle className="w-5 h-5 text-red-400" />
  };
}

// Barra de progresso
function UsageBar({ percentage, label, used, limit, equivalent }: { 
  percentage: number; 
  label: string; 
  used: string; 
  limit: string;
  equivalent?: string;
}) {
  const status = getStatusColor(percentage);
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm text-gray-400">{used} de {limit}</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${status.bar} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">{equivalent}</span>
        <span className={`text-xs font-medium ${status.text}`}>{percentage}%</span>
      </div>
    </div>
  );
}

export default function AdminUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/usage');
      if (!response.ok) throw new Error('Erro ao carregar dados');
      const data = await response.json();
      setUsage(data);
    } catch (err) {
      setError('Nao foi possivel carregar os dados de uso');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-400">{error || 'Erro ao carregar dados'}</p>
        <button 
          onClick={() => fetchUsage()}
          className="mt-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Monitoramento de Recursos</h2>
          <p className="text-gray-400 text-sm mt-1">
            Acompanhe o uso dos servicos do seu site
          </p>
        </div>
        <button
          onClick={() => fetchUsage(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Legenda de cores */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-400">Tranquilo (0-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-sm text-gray-400">Atencao (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-sm text-gray-400">Cuidado (90%+)</span>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cloudinary */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Cloud className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Cloudinary</h3>
              <p className="text-sm text-gray-400">Fotos e Videos</p>
            </div>
            {usage.cloudinary && (
              <span className="ml-auto text-xs px-2 py-1 bg-gray-700 rounded">
                {usage.cloudinary.plan}
              </span>
            )}
          </div>

          {usage.cloudinary ? (
            <>
              <UsageBar 
                percentage={usage.cloudinary.storage.percentage}
                label="Espaco Usado"
                used={usage.cloudinary.storage.usedFormatted}
                limit={usage.cloudinary.storage.limitFormatted}
                equivalent={getEquivalent(usage.cloudinary.storage.used, 'storage')}
              />
              
              <UsageBar 
                percentage={usage.cloudinary.bandwidth.percentage}
                label="Bandwidth (este mes)"
                used={usage.cloudinary.bandwidth.usedFormatted}
                limit={usage.cloudinary.bandwidth.limitFormatted}
                equivalent={getEquivalent(usage.cloudinary.bandwidth.used, 'bandwidth')}
              />

              <UsageBar 
                percentage={usage.cloudinary.credits.percentage}
                label="Creditos (renovam mensalmente)"
                used={String(usage.cloudinary.credits.used)}
                limit={String(usage.cloudinary.credits.limit)}
                equivalent="Transformacoes + storage + bandwidth"
              />

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Arquivos armazenados</span>
                  <span className="text-white">{usage.cloudinary.resources.toLocaleString()}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <HelpCircle className="w-8 h-8 mx-auto mb-2" />
              <p>Nao foi possivel conectar ao Cloudinary</p>
              <p className="text-xs mt-1">Verifique as credenciais</p>
            </div>
          )}
        </div>

        {/* Supabase */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Database className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Banco de Dados</h3>
              <p className="text-sm text-gray-400">Supabase (dados do site)</p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 bg-gray-700 rounded">
              Free
            </span>
          </div>

          <UsageBar 
            percentage={usage.supabase.database.percentage}
            label="Espaco Usado (estimado)"
            used={usage.supabase.database.usedFormatted}
            limit={usage.supabase.database.limitFormatted}
            equivalent={`${usage.supabase.totalRecords.toLocaleString()} registros`}
          />

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">Registros por tabela:</p>
            <div className="space-y-2">
              {usage.supabase.tables.map((table) => (
                <div key={table.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{table.name}</span>
                  <span className="text-gray-300">{table.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
            <p className="text-xs text-green-400">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              O banco dificilmente enche - so guarda texto
            </p>
          </div>
        </div>

        {/* Vercel */}
        <div className="bg-gray-800/50 rounded-xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Vercel</h3>
              <p className="text-sm text-gray-400">Onde o site fica online</p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 bg-gray-700 rounded">
              Hobby
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Bandwidth mensal</span>
                <span className="text-sm font-medium text-white">{usage.vercel.bandwidth.limitFormatted}</span>
              </div>
              <p className="text-xs text-gray-500">~100.000 visitantes por mes</p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Build Minutes</span>
                <span className="text-sm font-medium text-white">{usage.vercel.buildMinutes.limitFormatted}</span>
              </div>
              <p className="text-xs text-gray-500">~200 publicacoes por mes</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-400 mt-0.5" />
            <p className="text-xs text-purple-300">
              A Vercel nao fornece API de uso no plano gratuito. 
              Consulte o <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">dashboard da Vercel</a> para ver dados reais.
            </p>
          </div>
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400" />
          Dicas para Economizar Recursos
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-black/30 rounded-lg">
            <h4 className="text-sm font-medium text-blue-300 mb-2">Fotos</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>? Comprima antes de subir (tinypng.com)</li>
              <li>? Tamanho ideal: 1920x1080, qualidade 80%</li>
              <li>? Delete galerias antigas</li>
            </ul>
          </div>

          <div className="p-4 bg-black/30 rounded-lg">
            <h4 className="text-sm font-medium text-purple-300 mb-2">Videos</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>? Suba no YouTube e cole o link</li>
              <li>? Nao suba videos grandes direto</li>
              <li>? Video de fundo: max 30 segundos</li>
            </ul>
          </div>

          <div className="p-4 bg-black/30 rounded-lg">
            <h4 className="text-sm font-medium text-green-300 mb-2">Banco de Dados</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>? Nao precisa se preocupar</li>
              <li>? So guarda texto (ocupa pouco)</li>
              <li>? Espaco para milhares de galerias</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer com ultima atualizacao */}
      <div className="text-center text-xs text-gray-500">
        Ultima atualizacao: {new Date(usage.updatedAt).toLocaleString('pt-BR')}
      </div>
    </div>
  );
}

