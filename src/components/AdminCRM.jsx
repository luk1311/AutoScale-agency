import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import MetricsDashboard from './crm/MetricsDashboard';
import KanbanBoard from './crm/KanbanBoard';
import PortfolioEditor from './crm/PortfolioEditor';
import TemplatesLibrary from './crm/TemplatesLibrary';
// Playbook interno: se empaqueta en la app (NO es un archivo público). Solo se
// renderiza dentro del /admin autenticado vía iframe srcDoc.
import playbookHtml from '../assets/playbook.html?raw';
import { getCampaign, getChannel, parseMoneyInput } from '../lib/leadHelpers';
import { CheckCircle2, Inbox, Loader2, LayoutGrid, LayoutTemplate, Users, BookOpen } from 'lucide-react';
import './AdminCRM.css';

// Columnas que usa el CRM. Incluye atribución de marketing (origen/UTM/fbclid)
// y el valor estimado del trato para el pipeline.
const LEAD_COLUMNS =
  'id, created_at, nombre, empresa, correo, whatsapp, servicio, status, descripcion, url, ' +
  'origen, utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, valor_estimado';

const AdminCRM = () => {
  // Sesión real gestionada por Supabase Auth (no un flag en localStorage).
  const [session, setSession] = useState(null);
  // Si Supabase no está configurado, no hay sesión que esperar: listo de entrada.
  const [authReady, setAuthReady] = useState(() => !supabase);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterCampaign, setFilterCampaign] = useState('todas');
  // Vista activa: 'tabla' | 'kanban'
  const [view, setView] = useState('tabla');
  // Pestaña activa del CRM: 'leads' | 'portfolio'
  const [activeTab, setActiveTab] = useState('leads');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const isAuthenticated = !!session;

  // Suscribirse a la sesión de Supabase Auth
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Login con credenciales reales de Supabase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase no está configurado');
      return;
    }
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('Credenciales incorrectas');
    } else {
      setPassword('');
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      console.error('Supabase no está configurado');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('leads')
      .select(LEAD_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }, []);

  // Cargar leads cuando hay sesión activa (diferido para no hacer setState
  // de forma síncrona dentro del efecto).
  useEffect(() => {
    if (isAuthenticated) {
      queueMicrotask(fetchLeads);
    }
  }, [isAuthenticated, fetchLeads]);

  // Cambiar estado de un lead
  const updateLeadStatus = async (id, newStatus) => {
    if (!supabase) return;

    // Actualización optimista (functional update, sin closure obsoleto)
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      fetchLeads(); // Revertir al estado real
    } else {
      showToast('Estado actualizado correctamente');
    }
  };

  // Asignar/editar el valor estimado del trato (para el pipeline en $).
  const updateLeadValue = async (id, valor) => {
    if (!supabase) return;

    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, valor_estimado: valor } : lead));

    const { error } = await supabase
      .from('leads')
      .update({ valor_estimado: valor })
      .eq('id', id);

    if (error) {
      console.error('Error updating value:', error);
      fetchLeads();
    } else {
      showToast('Valor actualizado correctamente');
    }
  };

  // Abrir el canal de contacto del lead: WhatsApp si tiene número; si no, su perfil
  // (Instagram/web guardado en `url`), útil para prospectos de salida sin teléfono.
  const openWhatsApp = (lead) => {
    const phone = (lead.whatsapp || '').replace(/\D/g, '');
    const profile = (lead.url || '').trim();

    let target = null;
    if (phone) {
      const firstName = (lead.nombre || '').split(' ')[0] || 'allí';
      const text = `¡Hola ${firstName}! Soy de AutoScale Agency. Recibimos tu solicitud sobre "${lead.servicio}". ¿Cómo estás?`;
      target = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    } else if (profile) {
      target = profile.startsWith('http') ? profile : `https://${profile}`;
    }

    if (!target) {
      console.warn('Lead sin WhatsApp ni perfil para contactar:', lead.id);
      showToast('Este lead no tiene WhatsApp ni Instagram guardado todavía');
      return;
    }

    // Automatización: Si el lead es nuevo, marcarlo como "contactado" automáticamente.
    if (lead.status === 'nuevo' || !lead.status) {
      updateLeadStatus(lead.id, 'contactado');
    }

    window.open(target, '_blank', 'noopener,noreferrer');
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Calcular urgencia: ¿Lleva más de 24h siendo "nuevo"?
  const checkIsUrgent = (lead) => {
    if ((lead.status || 'nuevo') !== 'nuevo') return false;
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const diffHours = (now - createdAt) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  // Lista de campañas únicas presentes en los leads (para el filtro de atribución).
  const campaigns = useMemo(() => {
    const set = new Set(leads.map(getCampaign));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [leads]);

  // Filtrar los leads usando useMemo para mejor rendimiento
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Filtrar por estado
      const matchStatus = filterStatus === 'todos' || (lead.status || 'nuevo') === filterStatus;

      // Filtrar por campaña/origen
      const matchCampaign = filterCampaign === 'todas' || getCampaign(lead) === filterCampaign;

      // Filtrar por texto (nombre, correo o empresa)
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = searchTerm === '' ||
        (lead.nombre && lead.nombre.toLowerCase().includes(searchLower)) ||
        (lead.correo && lead.correo.toLowerCase().includes(searchLower)) ||
        (lead.empresa && lead.empresa.toLowerCase().includes(searchLower));

      return matchStatus && matchSearch && matchCampaign;
    });
  }, [leads, filterStatus, searchTerm, filterCampaign]);

  // Exportar a Excel (Formato nativo .xlsx con diseño profesional).
  // ExcelJS y file-saver se cargan bajo demanda (import dinámico) para no
  // inflar el bundle inicial: solo se descargan al exportar.
  const exportToExcel = async () => {
    if (filteredLeads.length === 0) return;

    const [{ default: ExcelJS }, { saveAs }] = await Promise.all([
      import('exceljs'),
      import('file-saver')
    ]);

    // Crear un nuevo libro de Excel y una hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leads CRM');

    // Configurar columnas con sus anchos
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Nombre', key: 'nombre', width: 25 },
      { header: 'Correo', key: 'correo', width: 35 },
      { header: 'WhatsApp', key: 'whatsapp', width: 20 },
      { header: 'Empresa', key: 'empresa', width: 25 },
      { header: 'Servicio', key: 'servicio', width: 30 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Origen', key: 'origen', width: 18 },
      { header: 'Campaña', key: 'campania', width: 28 },
      { header: 'Valor estimado', key: 'valor', width: 18 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
    ];

    // Añadir filas
    filteredLeads.forEach(lead => {
      worksheet.addRow({
        fecha: formatDate(lead.created_at),
        nombre: lead.nombre || '',
        correo: lead.correo || '',
        whatsapp: lead.whatsapp || '',
        empresa: lead.empresa || '',
        servicio: lead.servicio || '',
        estado: lead.status || 'nuevo',
        origen: getChannel(lead).label,
        campania: getCampaign(lead),
        valor: Number(lead.valor_estimado) || 0,
        descripcion: (lead.descripcion || '').replace(/\n/g, ' ')
      });
    });

    // Dar estilo a la cabecera (Azul con texto blanco)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1A73E8' } // Azul estilo Google
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRow.height = 25;

    // Añadir Filtros Automáticos
    worksheet.autoFilter = 'A1:K1';

    // Formato de moneda para la columna de valor
    worksheet.getColumn('valor').numFmt = '"$"#,##0';

    // Dar estilo a las filas (Bordes y filas intercaladas)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Ignorar cabecera
        if (rowNumber % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF3F6FC' } // Azul super claro
            };
          });
        }
        row.alignment = { vertical: 'middle', wrapText: true };
      }

      // Bordes para todas las celdas
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
        };
      });
    });

    // Generar archivo real
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Leads_AutoScale_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (!authReady) {
    return (
      <div className="crm-login-container">
        <p className="text-center">Cargando…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="crm-login-container">
        <div className="glass-panel crm-login-box">
          <h2>AutoScale <span className="text-gradient">CRM</span></h2>
          <p>Ingresa tus credenciales para entrar a tu centro de mando.</p>
          <form onSubmit={handleLogin} className="crm-login-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
              autoComplete="username"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
              required
            />
            {error && <p className="crm-error">{error}</p>}
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-dashboard">
      <header className="crm-header glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1>AutoScale <span className="text-gradient">CRM</span></h1>
          <nav className="crm-main-tabs" style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className={`btn ${activeTab === 'leads' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('leads')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Users size={16} /> Leads
            </button>
            <button
              className={`btn ${activeTab === 'plantillas' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('plantillas')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LayoutTemplate size={16} /> Plantillas
            </button>
            <button
              className={`btn ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('portfolio')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LayoutGrid size={16} /> Portafolio
            </button>
            <button 
              className={`btn ${activeTab === 'playbook' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('playbook')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <BookOpen size={16} /> Playbook
            </button>
          </nav>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>Salir</button>
      </header>

      {activeTab === 'playbook' ? (
        <div style={{ height: 'calc(100vh - 80px)', width: '100%', padding: '1rem', boxSizing: 'border-box' }}>
          <iframe
            srcDoc={playbookHtml}
            title="AutoScale Playbook"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
          />
        </div>
      ) : activeTab === 'plantillas' ? (
        <TemplatesLibrary />
      ) : activeTab === 'portfolio' ? (
        <PortfolioEditor />
      ) : (
        <>
          {/* Dashboard de métricas + embudo */}
          <MetricsDashboard leads={leads} />

      <div className="crm-toolbar glass-panel">
        <div className="crm-toolbar-search">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, correo o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="crm-search-input"
          />
        </div>
        <div className="crm-toolbar-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="crm-filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="nuevo">🔴 Nuevos</option>
            <option value="contactado">🟡 Contactados</option>
            <option value="propuesta">🔵 Propuesta Enviada</option>
            <option value="ganado">🟢 Ganados</option>
          </select>
          <select
            value={filterCampaign}
            onChange={(e) => setFilterCampaign(e.target.value)}
            className="crm-filter-select"
            title="Filtrar por campaña / origen"
          >
            <option value="todas">Todas las campañas</option>
            {campaigns.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="btn btn-secondary btn-export" onClick={exportToExcel} disabled={filteredLeads.length === 0}>
            📥 Exportar Excel
          </button>
        </div>
      </div>

      <div className="glass-panel crm-table-container">
        <div className="crm-table-header">
          <h2>Registro de Clientes ({filteredLeads.length})</h2>
          <div className="crm-header-actions">
            <div className="crm-view-toggle">
              <button
                className={`crm-view-btn ${view === 'tabla' ? 'crm-view-active' : ''}`}
                onClick={() => setView('tabla')}
              >
                ☰ Tabla
              </button>
              <button
                className={`crm-view-btn ${view === 'kanban' ? 'crm-view-active' : ''}`}
                onClick={() => setView('kanban')}
              >
                ▦ Pipeline
              </button>
            </div>
            <button className="btn btn-primary" onClick={fetchLeads}>↻ Refrescar</button>
          </div>
        </div>

        {loading ? (
          <div className="crm-empty-state">
            <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
            <p>Cargando clientes...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="crm-empty-state">
            <Inbox size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <p>No se encontraron clientes con estos filtros.</p>
          </div>
        ) : view === 'kanban' ? (
          <div style={{ padding: '1.5rem' }}>
            <KanbanBoard
              leads={filteredLeads}
              onStatusChange={updateLeadStatus}
              onValueChange={updateLeadValue}
              onWhatsApp={openWhatsApp}
            />
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Origen</th>
                  <th>Servicio</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const channel = getChannel(lead);
                  return (
                    <tr key={lead.id} style={checkIsUrgent(lead) ? { backgroundColor: 'rgba(255, 77, 77, 0.05)' } : {}}>
                      <td>
                        {formatDate(lead.created_at)}
                        {checkIsUrgent(lead) && (
                          <div style={{ color: '#ff4d4d', fontSize: '0.75rem', marginTop: '6px', fontWeight: 'bold' }}>
                            ⚠️ +24h sin responder
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{lead.nombre}</strong>
                        <br/>
                        <span className="text-small text-muted">{lead.empresa}</span>
                      </td>
                      <td>
                        <a href={`mailto:${lead.correo}`} className="crm-link">{lead.correo}</a>
                        <br/>
                        <span className="text-small">{lead.whatsapp}</span>
                      </td>
                      <td>
                        <span className="crm-channel-badge" style={{ color: channel.color, borderColor: channel.color }}>
                          {channel.emoji} {channel.label}
                        </span>
                        <br/>
                        <span className="text-small text-muted crm-campaign-cell" title={getCampaign(lead)}>
                          {getCampaign(lead)}
                        </span>
                      </td>
                      <td>{lead.servicio}</td>
                      <td>
                        <input
                          type="number"
                          className="crm-value-input"
                          min="0"
                          step="50000"
                          defaultValue={lead.valor_estimado ?? ''}
                          placeholder="$"
                          onBlur={(e) => {
                            const v = parseMoneyInput(e.target.value);
                            if (v !== parseMoneyInput(lead.valor_estimado)) updateLeadValue(lead.id, v);
                          }}
                        />
                      </td>
                      <td>
                        <select
                          className={`crm-status-select status-${lead.status || 'nuevo'}`}
                          value={lead.status || 'nuevo'}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        >
                          <option value="nuevo">🔴 Nuevo</option>
                          <option value="contactado">🟡 Contactado</option>
                          <option value="propuesta">🔵 Propuesta</option>
                          <option value="ganado">🟢 Ganado</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-whatsapp btn-small"
                          onClick={() => openWhatsApp(lead)}
                          title={(lead.whatsapp || '').replace(/\D/g, '') ? 'Enviar WhatsApp' : 'Abrir Instagram/perfil'}
                        >
                          {(lead.whatsapp || '').replace(/\D/g, '') ? '💬 WhatsApp' : '📷 Contactar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="crm-toast">
          <CheckCircle2 color="var(--accent-tertiary)" size={20} />
          {toastMessage}
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default AdminCRM;
