import { useMemo, useState } from 'react';
import { STATUS_ORDER, STATUS_META, formatMoney } from '../../lib/leadHelpers';
import './MetricsDashboard.css';

// Dashboard de métricas del CRM: tarjetas resumen + embudo de ventas.
// Recibe la lista COMPLETA de leads (no la filtrada) para reflejar el negocio real.
const MetricsDashboard = ({ leads }) => {
  // Momento de carga del CRM, fijado una vez (la ventana de "7 días" se mide
  // contra este instante). Lazy initializer = puro para las reglas de hooks.
  const [mountTime] = useState(() => Date.now());

  const stats = useMemo(() => {
    const byStatus = { nuevo: 0, contactado: 0, propuesta: 0, ganado: 0 };
    let pipelineAbierto = 0;
    let ganadoMonto = 0;
    let leadsSemana = 0;
    const weekAgo = mountTime - 7 * 24 * 60 * 60 * 1000;

    for (const l of leads) {
      const st = l.status || 'nuevo';
      if (byStatus[st] !== undefined) byStatus[st] += 1;

      const val = Number(l.valor_estimado) || 0;
      if (st === 'ganado') ganadoMonto += val;
      else pipelineAbierto += val; // nuevo + contactado + propuesta = pipeline abierto

      if (new Date(l.created_at).getTime() >= weekAgo) leadsSemana += 1;
    }

    const total = leads.length;
    const conv = total ? Math.round((byStatus.ganado / total) * 100) : 0;
    return { total, byStatus, pipelineAbierto, ganadoMonto, leadsSemana, conv };
  }, [leads, mountTime]);

  const maxFunnel = Math.max(stats.total, 1);

  return (
    <>
      <div className="crm-metrics">
        <div className="glass-panel metric-card">
          <h3>Total Leads</h3>
          <p className="metric-value">{stats.total}</p>
        </div>
        <div className="glass-panel metric-card">
          <h3>Nuevos (7 días)</h3>
          <p className="metric-value text-gradient">{stats.leadsSemana}</p>
        </div>
        <div className="glass-panel metric-card">
          <h3>Conversión</h3>
          <p className="metric-value">{stats.conv}%</p>
        </div>
        <div className="glass-panel metric-card">
          <h3>Pipeline Abierto</h3>
          <p className="metric-value metric-money">{formatMoney(stats.pipelineAbierto)}</p>
        </div>
        <div className="glass-panel metric-card">
          <h3>Ventas Ganadas</h3>
          <p className="metric-value metric-money" style={{ color: 'var(--accent-tertiary)' }}>
            {formatMoney(stats.ganadoMonto)}
          </p>
        </div>
      </div>

      <div className="glass-panel crm-funnel">
        <h3>Embudo de Ventas</h3>
        <div className="funnel-bars">
          {STATUS_ORDER.map((st) => {
            const count = stats.byStatus[st];
            const pct = Math.round((count / maxFunnel) * 100);
            return (
              <div key={st} className="funnel-row">
                <span className="funnel-label">
                  {STATUS_META[st].emoji} {STATUS_META[st].label}
                </span>
                <div className="funnel-track">
                  <div
                    className="funnel-fill"
                    style={{ width: `${pct}%`, background: STATUS_META[st].color }}
                  />
                </div>
                <span className="funnel-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MetricsDashboard;
