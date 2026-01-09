'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lead } from '@/lib/supabase';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { 
  Search, X, MessageCircle, Trash2, ChevronDown, 
  Clock, CheckCircle2, XCircle, UserCheck, Mail, Phone, Building2, FileText,
  TrendingUp, DollarSign, Calendar, AlertCircle, Filter, BarChart3,
  MapPin, Tag, Star, Bell, Send, ExternalLink
} from 'lucide-react';

type StatusFilter = 'todos' | 'novo' | 'contatado' | 'proposta' | 'negociando' | 'fechado' | 'perdido';

interface StatusCounts {
  todos: number;
  novo: number;
  contatado: number;
  proposta: number;
  negociando: number;
  fechado: number;
  perdido: number;
}

interface Metricas {
  leadsEsteMes: number;
  taxaConversao: number;
  valorPipeline: number;
  followUpsPendentes: number;
  leadsPorMes: { mes: string; total: number }[];
}

const statusConfig = {
  novo: { label: 'Novo', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  contatado: { label: 'Contatado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: UserCheck },
  proposta: { label: 'Proposta', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: FileText },
  negociando: { label: 'Negociando', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: TrendingUp },
  fechado: { label: 'Fechado', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2 },
  perdido: { label: 'Perdido', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: XCircle },
};

const tipoServicoConfig = {
  casamento: { label: 'Casamento', emoji: '??' },
  evento: { label: 'Evento', emoji: '??' },
  corporativo: { label: 'Corporativo', emoji: '??' },
  clip: { label: 'Clip Musical', emoji: '??' },
  outro: { label: 'Outro', emoji: '??' },
};

const origemConfig = {
  site: { label: 'Site', color: 'bg-blue-500/20 text-blue-400' },
  instagram: { label: 'Instagram', color: 'bg-pink-500/20 text-pink-400' },
  google: { label: 'Google', color: 'bg-red-500/20 text-red-400' },
  indicacao: { label: 'Indicacao', color: 'bg-green-500/20 text-green-400' },
  outro: { label: 'Outro', color: 'bg-gray-500/20 text-gray-400' },
};

const prioridadeConfig = {
  alta: { label: 'Alta', color: 'text-red-400', bg: 'bg-red-500/20' },
  media: { label: 'Media', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  baixa: { label: 'Baixa', color: 'text-gray-400', bg: 'bg-gray-500/20' },
};

const whatsappTemplates = [
  {
    nome: 'Primeiro contato',
    mensagem: 'Ola {nome}! Tudo bem?\n\nVi que voce entrou em contato conosco pelo site TIERRIFILMS.\n\nComo posso ajudar?'
  },
  {
    nome: 'Agendar reuniao',
    mensagem: 'Ola {nome}!\n\nGostaria de agendar uma reuniao para conversarmos sobre seu projeto.\n\nQual seria o melhor dia e horario para voce?'
  },
  {
    nome: 'Enviar proposta',
    mensagem: 'Ola {nome}!\n\nSegue em anexo a proposta para o seu projeto.\n\nFique a vontade para entrar em contato caso tenha alguma duvida!'
  },
  {
    nome: 'Follow-up',
    mensagem: 'Ola {nome}!\n\nTudo bem? Passando para saber se voce teve a oportunidade de analisar nossa proposta.\n\nEstou a disposicao para esclarecer qualquer duvida!'
  },
];

export default function AdminClientes() {
  const { isMobile } = useMediaQuery();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({ todos: 0, novo: 0, contatado: 0, proposta: 0, negociando: 0, fechado: 0, perdido: 0 });
  const [metricas, setMetricas] = useState<Metricas>({ leadsEsteMes: 0, taxaConversao: 0, valorPipeline: 0, followUpsPendentes: 0, leadsPorMes: [] });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [busca, setBusca] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Filtros avancados
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todos');
  const [filtroOrigem, setFiltroOrigem] = useState('todos');

  const loadLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'todos') params.set('status', statusFilter);
      if (busca) params.set('busca', busca);
      if (filtroTipo !== 'todos') params.set('tipo_servico', filtroTipo);
      if (filtroPrioridade !== 'todos') params.set('prioridade', filtroPrioridade);
      if (filtroOrigem !== 'todos') params.set('origem', filtroOrigem);

      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setCounts(data.counts);
        setMetricas(data.metricas);
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    }
    setLoading(false);
  }, [statusFilter, busca, filtroTipo, filtroPrioridade, filtroOrigem]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleUpdateLead = async (leadId: string, updates: Partial<Lead>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, ...updates }),
      });

      if (res.ok) {
        const updatedLead = await res.json();
        await loadLeads();
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
    setSaving(false);
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    try {
      const res = await fetch(`/api/admin/leads?id=${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        await loadLeads();
        if (selectedLead?.id === leadId) setSelectedLead(null);
      }
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
    }
  };

  const openWhatsApp = (lead: Lead, template?: string) => {
    const whatsappNumber = lead.telefone?.replace(/\D/g, '') || '';
    if (!whatsappNumber) {
      alert('Este lead nao possui telefone cadastrado');
      return;
    }

    const mensagem = template 
      ? template.replace('{nome}', lead.nome.split(' ')[0])
      : `Ola ${lead.nome.split(' ')[0]}! Tudo bem?\n\nVi que voce entrou em contato conosco pelo site TIERRIFILMS.\n\nComo posso ajudar?`;
    
    const url = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    setShowTemplates(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDateSimple = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Verifica se tem follow-up pendente
  const hasFollowUpPending = (lead: Lead) => {
    if (!lead.proximo_contato) return false;
    const hoje = new Date().toISOString().split('T')[0];
    return lead.proximo_contato.split('T')[0] <= hoje && !['fechado', 'perdido'].includes(lead.status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all";
  const selectClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white transition-all appearance-none cursor-pointer";

  // Calcular altura maxima do grafico
  const maxLeads = Math.max(...metricas.leadsPorMes.map(m => m.total), 1);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">CRM - Gestao de Leads</h2>
        <p className="text-gray-400 text-sm mt-1">Pipeline de vendas e acompanhamento de clientes</p>
      </div>

      {/* Dashboard de Metricas */}
      <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Leads este mes</span>
          </div>
          <p className="text-2xl font-bold text-white">{metricas.leadsEsteMes}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-gray-400 text-sm">Taxa conversao</span>
          </div>
          <p className="text-2xl font-bold text-white">{metricas.taxaConversao}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Pipeline</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(metricas.valorPipeline)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-gray-400 text-sm">Follow-ups</span>
          </div>
          <p className="text-2xl font-bold text-white">{metricas.followUpsPendentes}</p>
          {metricas.followUpsPendentes > 0 && (
            <p className="text-xs text-amber-400 mt-1">pendentes</p>
          )}
        </div>
      </div>

      {/* Mini Grafico de Leads por Mes */}
      {!isMobile && metricas.leadsPorMes.length > 0 && (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Leads nos ultimos 6 meses</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-20">
            {metricas.leadsPorMes.map((mes, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500/50 to-blue-400/30 rounded-t"
                  style={{ height: `${(mes.total / maxLeads) * 100}%`, minHeight: mes.total > 0 ? '8px' : '2px' }}
                />
                <span className="text-xs text-gray-500">{mes.mes}</span>
                <span className="text-xs font-medium text-gray-400">{mes.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros de Status */}
      <div className={`flex gap-2 mb-4 ${isMobile ? 'flex-wrap' : 'overflow-x-auto pb-2'}`}>
        {(['todos', 'novo', 'contatado', 'proposta', 'negociando', 'fechado', 'perdido'] as StatusFilter[]).map((status) => {
          const count = counts[status];
          const isActive = statusFilter === status;
          const config = status !== 'todos' ? statusConfig[status] : null;
          
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {config && <config.icon className="w-4 h-4" />}
              {status === 'todos' ? 'Todos' : config?.label}
              <span className={`px-1.5 py-0.5 text-xs rounded ${isActive ? 'bg-black/20' : 'bg-gray-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Busca e Filtros Avancados */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, email ou empresa..."
            className={`${inputClass} pl-11`}
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-colors ${
            showFilters || filtroTipo !== 'todos' || filtroPrioridade !== 'todos' || filtroOrigem !== 'todos'
              ? 'bg-white text-black'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          {!isMobile && 'Filtros'}
        </button>
      </div>

      {/* Painel de Filtros Avancados */}
      {showFilters && (
        <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6 grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Tipo de Servico</label>
            <div className="relative">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className={selectClass}
              >
                <option value="todos">Todos os tipos</option>
                <option value="casamento">Casamento</option>
                <option value="evento">Evento</option>
                <option value="corporativo">Corporativo</option>
                <option value="clip">Clip Musical</option>
                <option value="outro">Outro</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Prioridade</label>
            <div className="relative">
              <select
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
                className={selectClass}
              >
                <option value="todos">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baixa">Baixa</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Origem</label>
            <div className="relative">
              <select
                value={filtroOrigem}
                onChange={(e) => setFiltroOrigem(e.target.value)}
                className={selectClass}
              >
                <option value="todos">Todas</option>
                <option value="site">Site</option>
                <option value="instagram">Instagram</option>
                <option value="google">Google</option>
                <option value="indicacao">Indicacao</option>
                <option value="outro">Outro</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {(filtroTipo !== 'todos' || filtroPrioridade !== 'todos' || filtroOrigem !== 'todos') && (
            <button
              onClick={() => {
                setFiltroTipo('todos');
                setFiltroPrioridade('todos');
                setFiltroOrigem('todos');
              }}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Lista de Leads */}
      {leads.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl">
          <MessageCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum lead encontrado</p>
          <p className="text-gray-600 text-sm mt-1">
            {statusFilter !== 'todos' ? 'Tente outro filtro' : 'Aguardando contatos do site'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const config = statusConfig[lead.status];
            const StatusIcon = config.icon;
            const tipoConfig = lead.tipo_servico ? tipoServicoConfig[lead.tipo_servico] : null;
            const origemConf = lead.origem ? origemConfig[lead.origem] : null;
            const prioridadeConf = lead.prioridade ? prioridadeConfig[lead.prioridade] : null;
            const hasPendingFollowUp = hasFollowUpPending(lead);
            
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors border ${
                  hasPendingFollowUp ? 'border-amber-500/50' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium truncate">{lead.nome}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 border ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                      {prioridadeConf && lead.prioridade !== 'media' && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${prioridadeConf.bg} ${prioridadeConf.color}`}>
                          {lead.prioridade === 'alta' && <Star className="w-3 h-3 inline mr-1" />}
                          {prioridadeConf.label}
                        </span>
                      )}
                      {hasPendingFollowUp && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Follow-up
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {lead.empresa && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {lead.empresa}
                        </span>
                      )}
                      {tipoConfig && (
                        <span className="text-xs text-gray-500">
                          {tipoConfig.emoji} {tipoConfig.label}
                        </span>
                      )}
                      {lead.data_evento && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateSimple(lead.data_evento)}
                        </span>
                      )}
                      {lead.orcamento_estimado && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(lead.orcamento_estimado)}
                        </span>
                      )}
                      {origemConf && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${origemConf.color}`}>
                          {origemConf.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{formatDate(lead.created_at)}</p>
                    {lead.telefone && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openWhatsApp(lead);
                        }}
                        className="mt-2 p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedLead && (
        <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 ${isMobile ? '' : 'p-4'}`}>
          <div className={`bg-gray-900 w-full ${isMobile ? 'h-full' : 'max-w-2xl rounded-2xl max-h-[90vh]'} flex flex-col`}>
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
              <h3 className="text-lg font-semibold">Detalhes do Lead</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteudo Scrollavel */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Info do Lead */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {selectedLead.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedLead.nome}</p>
                    <p className="text-sm text-gray-500">{formatDate(selectedLead.created_at)}</p>
                  </div>
                  {selectedLead.prioridade && (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${prioridadeConfig[selectedLead.prioridade].bg} ${prioridadeConfig[selectedLead.prioridade].color}`}>
                      {prioridadeConfig[selectedLead.prioridade].label}
                    </span>
                  )}
                </div>

                {/* Contatos */}
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${selectedLead.email}`} className="text-gray-300 hover:text-white flex items-center gap-1">
                      {selectedLead.email}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {selectedLead.telefone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300">{selectedLead.telefone}</span>
                    </div>
                  )}
                  {selectedLead.empresa && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300">{selectedLead.empresa}</span>
                    </div>
                  )}
                </div>

                {/* Projeto */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <FileText className="w-4 h-4" />
                    Sobre o projeto
                  </div>
                  <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-xl whitespace-pre-wrap">
                    {selectedLead.projeto}
                  </p>
                </div>

                {/* Grid de campos do CRM */}
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {/* Status */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Status</label>
                    <div className="relative">
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleUpdateLead(selectedLead.id, { status: e.target.value as Lead['status'] })}
                        disabled={saving}
                        className={selectClass}
                      >
                        <option value="novo">Novo</option>
                        <option value="contatado">Contatado</option>
                        <option value="proposta">Proposta Enviada</option>
                        <option value="negociando">Negociando</option>
                        <option value="fechado">Fechado</option>
                        <option value="perdido">Perdido</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tipo de Servico */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Tipo de Servico
                    </label>
                    <div className="relative">
                      <select
                        value={selectedLead.tipo_servico || ''}
                        onChange={(e) => handleUpdateLead(selectedLead.id, { tipo_servico: e.target.value as Lead['tipo_servico'] })}
                        disabled={saving}
                        className={selectClass}
                      >
                        <option value="">Selecionar...</option>
                        <option value="casamento">Casamento</option>
                        <option value="evento">Evento</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="clip">Clip Musical</option>
                        <option value="outro">Outro</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Data do Evento */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Data do Evento
                    </label>
                    <input
                      type="date"
                      value={selectedLead.data_evento || ''}
                      onChange={(e) => handleUpdateLead(selectedLead.id, { data_evento: e.target.value })}
                      disabled={saving}
                      className={inputClass}
                    />
                  </div>

                  {/* Local do Evento */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Local do Evento
                    </label>
                    <input
                      type="text"
                      value={selectedLead.local_evento || ''}
                      onChange={(e) => handleUpdateLead(selectedLead.id, { local_evento: e.target.value })}
                      disabled={saving}
                      placeholder="Cidade / Local"
                      className={inputClass}
                    />
                  </div>

                  {/* Orcamento */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Orcamento Estimado
                    </label>
                    <input
                      type="number"
                      value={selectedLead.orcamento_estimado || ''}
                      onChange={(e) => handleUpdateLead(selectedLead.id, { orcamento_estimado: Number(e.target.value) || undefined })}
                      disabled={saving}
                      placeholder="R$ 0,00"
                      className={inputClass}
                    />
                  </div>

                  {/* Prioridade */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Star className="w-4 h-4 inline mr-1" />
                      Prioridade
                    </label>
                    <div className="relative">
                      <select
                        value={selectedLead.prioridade || 'media'}
                        onChange={(e) => handleUpdateLead(selectedLead.id, { prioridade: e.target.value as Lead['prioridade'] })}
                        disabled={saving}
                        className={selectClass}
                      >
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baixa">Baixa</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Origem */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Origem</label>
                    <div className="relative">
                      <select
                        value={selectedLead.origem || 'site'}
                        onChange={(e) => handleUpdateLead(selectedLead.id, { origem: e.target.value as Lead['origem'] })}
                        disabled={saving}
                        className={selectClass}
                      >
                        <option value="site">Site</option>
                        <option value="instagram">Instagram</option>
                        <option value="google">Google</option>
                        <option value="indicacao">Indicacao</option>
                        <option value="outro">Outro</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Proximo Contato */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Bell className="w-4 h-4 inline mr-1" />
                      Proximo Follow-up
                    </label>
                    <input
                      type="date"
                      value={selectedLead.proximo_contato?.split('T')[0] || ''}
                      onChange={(e) => handleUpdateLead(selectedLead.id, { proximo_contato: e.target.value })}
                      disabled={saving}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Notas internas</label>
                  <textarea
                    defaultValue={selectedLead.notas || ''}
                    onBlur={(e) => handleUpdateLead(selectedLead.id, { notas: e.target.value })}
                    placeholder="Adicione notas sobre este lead..."
                    className={`${inputClass} resize-none`}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Footer com Acoes */}
            <div className="p-6 border-t border-gray-800 flex-shrink-0">
              <div className="flex gap-3">
                {selectedLead.telefone && (
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                      <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Menu de Templates */}
                    {showTemplates && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                        <div className="p-2 border-b border-gray-700">
                          <p className="text-xs text-gray-400 px-2">Escolha uma mensagem:</p>
                        </div>
                        {whatsappTemplates.map((template, i) => (
                          <button
                            key={i}
                            onClick={() => openWhatsApp(selectedLead, template.mensagem)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-3"
                          >
                            <Send className="w-4 h-4 text-green-400" />
                            <span className="text-sm">{template.nome}</span>
                          </button>
                        ))}
                        <button
                          onClick={() => openWhatsApp(selectedLead)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-3 border-t border-gray-700"
                        >
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Mensagem padrao</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="px-4 py-3 bg-gray-800 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {!isMobile && 'Email'}
                </a>
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  className="px-4 py-3 bg-gray-800 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
