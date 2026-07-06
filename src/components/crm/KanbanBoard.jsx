import { useState } from 'react';
import {
  STATUS_ORDER,
  STATUS_META,
  getCampaign,
  getChannel,
  formatMoney,
  parseMoneyInput,
} from '../../lib/leadHelpers';
import './KanbanBoard.css';

// Tablero Kanban del pipeline. Arrastra leads entre columnas para cambiar su
// estado. Cada columna muestra el total en $ de los tratos que contiene.
const KanbanBoard = ({ leads, onStatusChange, onValueChange, onWhatsApp }) => {
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const handleDrop = (status) => {
    if (dragId) {
      const lead = leads.find((l) => l.id === dragId);
      if (lead && (lead.status || 'nuevo') !== status) onStatusChange(dragId, status);
    }
    setDragId(null);
    setOverCol(null);
  };

  return (
    <div className="kanban-board">
      {STATUS_ORDER.map((status) => {
        const colLeads = leads.filter((l) => (l.status || 'nuevo') === status);
        const colTotal = colLeads.reduce((s, l) => s + (Number(l.valor_estimado) || 0), 0);

        return (
          <div
            key={status}
            className={`kanban-col ${overCol === status ? 'kanban-col-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              if (overCol !== status) setOverCol(status);
            }}
            onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
            onDrop={() => handleDrop(status)}
          >
            <div
              className="kanban-col-header"
              style={{ borderTopColor: STATUS_META[status].color }}
            >
              <span>
                {STATUS_META[status].emoji} {STATUS_META[status].label}
              </span>
              <span className="kanban-col-count">{colLeads.length}</span>
            </div>
            {colTotal > 0 && <div className="kanban-col-total">{formatMoney(colTotal)}</div>}

            <div className="kanban-col-body">
              {colLeads.map((lead) => {
                const channel = getChannel(lead);
                return (
                  <div
                    key={lead.id}
                    className={`kanban-card ${dragId === lead.id ? 'kanban-card-dragging' : ''}`}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                  >
                    <div className="kanban-card-top">
                      <strong>{lead.nombre}</strong>
                      <span
                        className="kanban-channel"
                        style={{ color: channel.color }}
                        title={`${channel.label} · ${getCampaign(lead)}`}
                      >
                        {channel.emoji}
                      </span>
                    </div>
                    <span className="kanban-empresa">{lead.empresa || '—'}</span>
                    <span className="kanban-servicio">{lead.servicio}</span>
                    <span className="kanban-campaign" title="Campaña / origen">
                      {getCampaign(lead)}
                    </span>

                    <div className="kanban-card-value">
                      <span className="kanban-money-prefix">$</span>
                      <input
                        type="number"
                        min="0"
                        step="50000"
                        defaultValue={lead.valor_estimado ?? ''}
                        placeholder="Valor estimado"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const v = parseMoneyInput(e.target.value);
                          if (v !== parseMoneyInput(lead.valor_estimado)) onValueChange(lead.id, v);
                        }}
                      />
                    </div>

                    <button
                      className="btn btn-whatsapp btn-small kanban-wa"
                      onClick={() => onWhatsApp(lead)}
                    >
                      {(lead.whatsapp || '').replace(/\D/g, '') ? '💬 WhatsApp' : '📷 Contactar'}
                    </button>
                  </div>
                );
              })}
              {colLeads.length === 0 && <p className="kanban-empty">Sin leads</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
