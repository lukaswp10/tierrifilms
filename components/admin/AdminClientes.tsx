'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/supabase';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { 
  Search, X, MessageCircle, Trash2, ChevronDown, 
  Clock, CheckCircle2, XCircle, UserCheck, Mail, Phone, Building2, FileText
} from 'lucide-react';

type StatusFilter = 'todos' | 'novo' | 'contatado' | 'fechado' | 'perdido';

interface StatusCounts {
  todos: number;
  novo: number;
  contatado: number;
  fechado: number;
  perdido: number;
}

const statusConfig = {
  novo: { label: 'Novo', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  contatado: { label: 'Contatado', color: 'bg-blue-500/20 text-blue-400', icon: UserCheck },
  fechado: { label: 'Fechado', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  perdido: { label: 'Perdido', color: 'bg-gray-500/20 text-gray-400', icon: XCircle },
};

export default function AdminClientes() {
  const { isMobile } = useMediaQuery();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({ todos: 0, novo: 0, contatado: 0, fechado: 0, perdido: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [busca, setBusca] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [statusFilter, busca]);

  const loadLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'todos') params.set('status', statusFilter);
      if (busca) params.set('busca', busca);

      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setCounts(data.counts);
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (res.ok) {
        await loadLeads();
        if (selectedLead?.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
    setSaving(false);
  };

  const handleUpdateNotas = async (leadId: string, notas: string) => {
    try {
      await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, notas }),
      });
    } catch (error) {
      console.error('Erro ao atualizar notas:', error);
    }
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

  const openWhatsApp = (lead: Lead) => {
    const whatsappNumber = lead.telefone?.replace(/\D/g, '') || '';
    if (!whatsappNumber) {
      alert('Este lead nao possui telefone cadastrado');
      return;
    }

    const mensagem = `Ola ${lead.nome}! Tudo bem?\n\nVi que voce entrou em contato conosco pelo site TIERRIFILMS.\n\nComo posso ajudar?`;
    const url = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Clientes</h2>
        <p className="text-gray-400 text-sm mt-1">Leads do formulario de contato</p>
      </div>

      {/* Filtros de Status */}
      <div className={`flex gap-2 mb-4 ${isMobile ? 'flex-wrap' : ''}`}>
        {(['todos', 'novo', 'contatado', 'fechado', 'perdido'] as StatusFilter[]).map((status) => {
          const count = counts[status];
          const isActive = statusFilter === status;
          const config = status !== 'todos' ? statusConfig[status] : null;
          
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
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

      {/* Busca */}
      <div className="relative mb-6">
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
            
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{lead.nome}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                    {lead.empresa && (
                      <p className="text-sm text-gray-600 truncate">{lead.empresa}</p>
                    )}
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
          <div className={`bg-gray-900 w-full ${isMobile ? 'h-full overflow-y-auto' : 'max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto'} p-6`}>
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Detalhes do Lead</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info do Lead */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium text-lg">
                  {selectedLead.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{selectedLead.nome}</p>
                  <p className="text-sm text-gray-500">{formatDate(selectedLead.created_at)}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href={`mailto:${selectedLead.email}`} className="text-gray-300 hover:text-white">
                    {selectedLead.email}
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

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as Lead['status'])}
                    disabled={saving}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="novo">Novo</option>
                    <option value="contatado">Contatado</option>
                    <option value="fechado">Fechado</option>
                    <option value="perdido">Perdido</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Notas internas</label>
                <textarea
                  defaultValue={selectedLead.notas || ''}
                  onBlur={(e) => handleUpdateNotas(selectedLead.id, e.target.value)}
                  placeholder="Adicione notas sobre este lead..."
                  className={`${inputClass} resize-none`}
                  rows={3}
                />
              </div>
            </div>

            {/* Acoes */}
            <div className="flex gap-3">
              {selectedLead.telefone && (
                <button
                  onClick={() => openWhatsApp(selectedLead)}
                  className="flex-1 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedLead.id)}
                className="px-4 py-3 bg-gray-800 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

