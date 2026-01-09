'use client';

import { useState } from 'react';
import { Lead } from '@/lib/supabase';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Clock, CheckCircle2, XCircle, UserCheck, FileText, TrendingUp,
  DollarSign, Calendar, Star, AlertCircle, Building2, GripVertical
} from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: Lead['status']) => void;
  onSelectLead: (lead: Lead) => void;
  formatCurrency: (value: number) => string;
  formatDateSimple: (date?: string) => string;
  isMobile?: boolean;
}

type StatusKey = 'novo' | 'contatado' | 'proposta' | 'negociando' | 'fechado' | 'perdido';

const statusConfig: Record<StatusKey, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  novo: { label: 'Novo', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/30', icon: Clock },
  contatado: { label: 'Contatado', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30', icon: UserCheck },
  proposta: { label: 'Proposta', color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/30', icon: FileText },
  negociando: { label: 'Negociando', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10 border-cyan-500/30', icon: TrendingUp },
  fechado: { label: 'Fechado', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/30', icon: CheckCircle2 },
  perdido: { label: 'Perdido', color: 'text-gray-400', bgColor: 'bg-gray-500/10 border-gray-500/30', icon: XCircle },
};

const prioridadeConfig = {
  alta: { label: 'Alta', color: 'text-red-400', bg: 'bg-red-500/20' },
  media: { label: 'Media', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  baixa: { label: 'Baixa', color: 'text-gray-400', bg: 'bg-gray-500/20' },
};

// Componente do Card arrastavel
function KanbanCard({ 
  lead, 
  onSelect, 
  formatCurrency, 
  formatDateSimple,
  isMobile = false,
}: { 
  lead: Lead; 
  onSelect: () => void; 
  formatCurrency: (v: number) => string;
  formatDateSimple: (d?: string) => string;
  isMobile?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasFollowUpPending = () => {
    if (!lead.proximo_contato) return false;
    const hoje = new Date().toISOString().split('T')[0];
    return lead.proximo_contato.split('T')[0] <= hoje && !['fechado', 'perdido'].includes(lead.status);
  };

  const prioridadeConf = lead.prioridade ? prioridadeConfig[lead.prioridade] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-800 rounded-xl p-3 cursor-pointer hover:bg-gray-750 transition-colors border ${
        hasFollowUpPending() ? 'border-amber-500/50' : 'border-gray-700/50'
      } ${isDragging ? 'shadow-lg ring-2 ring-white/20' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className={`p-1 text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing touch-none ${isMobile ? 'p-2' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm truncate">{lead.nome}</p>
            {prioridadeConf && lead.prioridade === 'alta' && (
              <Star className="w-3 h-3 text-red-400 flex-shrink-0" />
            )}
            {hasFollowUpPending() && (
              <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
            )}
          </div>
          
          {lead.empresa && (
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {lead.empresa}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {lead.orcamento_estimado && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(lead.orcamento_estimado)}
              </span>
            )}
            {lead.data_evento && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDateSimple(lead.data_evento)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente da Coluna com Droppable
function KanbanColumn({ 
  status, 
  leads, 
  totalValue,
  onSelectLead,
  formatCurrency,
  formatDateSimple,
  isMobile = false,
  isOver = false,
}: { 
  status: StatusKey;
  leads: Lead[];
  totalValue: number;
  onSelectLead: (lead: Lead) => void;
  formatCurrency: (v: number) => string;
  formatDateSimple: (d?: string) => string;
  isMobile?: boolean;
  isOver?: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });
  
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 rounded-xl border transition-all ${config.bgColor} ${
        isMobile ? 'w-[200px]' : 'w-[260px]'
      } ${isOver ? 'ring-2 ring-white/30 scale-[1.02]' : ''}`}
    >
      {/* Header da coluna */}
      <div className="p-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className={`font-medium text-sm ${config.color}`}>{config.label}</span>
            <span className="px-1.5 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded">
              {leads.length}
            </span>
          </div>
        </div>
        {totalValue > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(totalValue)}
          </p>
        )}
      </div>

      {/* Cards */}
      <div className={`p-2 space-y-2 min-h-[150px] overflow-y-auto ${isMobile ? 'max-h-[50vh]' : 'max-h-[60vh]'}`}>
        <SortableContext
          items={leads.map(l => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onSelect={() => onSelectLead(lead)}
              formatCurrency={formatCurrency}
              formatDateSimple={formatDateSimple}
              isMobile={isMobile}
            />
          ))}
        </SortableContext>
        
        {leads.length === 0 && (
          <div className={`text-center py-6 text-gray-600 text-sm border-2 border-dashed border-gray-700/50 rounded-lg ${
            isOver ? 'border-white/30 bg-white/5' : ''
          }`}>
            {isOver ? 'Solte aqui' : 'Arraste leads aqui'}
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ 
  leads, 
  onUpdateStatus, 
  onSelectLead,
  formatCurrency,
  formatDateSimple,
  isMobile = false,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Agrupar leads por status
  const columns: Record<StatusKey, Lead[]> = {
    novo: leads.filter(l => l.status === 'novo'),
    contatado: leads.filter(l => l.status === 'contatado'),
    proposta: leads.filter(l => l.status === 'proposta'),
    negociando: leads.filter(l => l.status === 'negociando'),
    fechado: leads.filter(l => l.status === 'fechado'),
    perdido: leads.filter(l => l.status === 'perdido'),
  };

  // Calcular valor total por coluna
  const columnValues: Record<StatusKey, number> = {
    novo: columns.novo.reduce((acc, l) => acc + (l.orcamento_estimado || 0), 0),
    contatado: columns.contatado.reduce((acc, l) => acc + (l.orcamento_estimado || 0), 0),
    proposta: columns.proposta.reduce((acc, l) => acc + (l.orcamento_estimado || 0), 0),
    negociando: columns.negociando.reduce((acc, l) => acc + (l.orcamento_estimado || 0), 0),
    fechado: columns.fechado.reduce((acc, l) => acc + (l.orcamento_estimado || 0), 0),
    perdido: columns.perdido.reduce((acc, l) => acc + (l.orcamento_estimado || 0), 0),
  };

  const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setOverColumnId(null);
      return;
    }

    const overId = String(event.over.id);
    
    // Verificar se over e uma coluna
    if (Object.keys(statusConfig).includes(overId)) {
      setOverColumnId(overId);
    } else {
      // Se e um lead, encontrar a coluna dele
      const overLead = leads.find(l => l.id === overId);
      if (overLead) {
        setOverColumnId(overLead.status);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverColumnId(null);

    if (!over) return;

    const activeLeadId = active.id as string;
    const overId = over.id as string;

    // Encontrar a coluna de destino
    let targetStatus: StatusKey | null = null;

    // Verificar se over e uma coluna (drop em area vazia)
    if (Object.keys(statusConfig).includes(overId)) {
      targetStatus = overId as StatusKey;
    } else {
      // Se over e um lead, pegar o status dele
      const overLead = leads.find(l => l.id === overId);
      if (overLead) {
        targetStatus = overLead.status as StatusKey;
      }
    }

    if (targetStatus) {
      const activeLead = leads.find(l => l.id === activeLeadId);
      if (activeLead && activeLead.status !== targetStatus) {
        onUpdateStatus(activeLeadId, targetStatus);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex gap-3 overflow-x-auto pb-4 ${isMobile ? '-mx-4 px-4' : ''}`}>
        {(Object.keys(columns) as StatusKey[]).map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={columns[status]}
            totalValue={columnValues[status]}
            onSelectLead={onSelectLead}
            formatCurrency={formatCurrency}
            formatDateSimple={formatDateSimple}
            isMobile={isMobile}
            isOver={overColumnId === status}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead && (
          <div className="bg-gray-800 rounded-xl p-3 border border-white/20 shadow-xl opacity-90">
            <p className="font-medium text-sm">{activeLead.nome}</p>
            {activeLead.empresa && (
              <p className="text-xs text-gray-500">{activeLead.empresa}</p>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
