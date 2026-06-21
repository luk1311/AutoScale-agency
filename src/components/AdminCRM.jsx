import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import './AdminCRM.css';

// Columnas que realmente usa el CRM (evita traer datos de más).
const LEAD_COLUMNS = 'id, created_at, nombre, empresa, correo, whatsapp, servicio, status, descripcion';

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
    }
  };

  // Abrir WhatsApp (con guardas por si algún campo viene vacío)
  const openWhatsApp = (lead) => {
    const firstName = (lead.nombre || '').split(' ')[0] || 'allí';
    const phone = (lead.whatsapp || '').replace(/\D/g, '');
    if (!phone) {
      console.warn('Lead sin número de WhatsApp válido:', lead.id);
      return;
    }

    // Automatización: Si el lead es nuevo, cambiarlo a "contactado" automáticamente
    if (lead.status === 'nuevo' || !lead.status) {
      updateLeadStatus(lead.id, 'contactado');
    }

    const text = `¡Hola ${firstName}! Soy de AutoScale Agency. Recibimos tu solicitud sobre "${lead.servicio}". ¿Cómo estás?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
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

  // Filtrar los leads usando useMemo para mejor rendimiento
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Filtrar por estado
      const matchStatus = filterStatus === 'todos' || (lead.status || 'nuevo') === filterStatus;
      
      // Filtrar por texto (nombre, correo o empresa)
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = searchTerm === '' || 
        (lead.nombre && lead.nombre.toLowerCase().includes(searchLower)) ||
        (lead.correo && lead.correo.toLowerCase().includes(searchLower)) ||
        (lead.empresa && lead.empresa.toLowerCase().includes(searchLower));
        
      return matchStatus && matchSearch;
    });
  }, [leads, filterStatus, searchTerm]);

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
    worksheet.autoFilter = 'A1:H1';
    
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
          <h2>🔐 Acceso Administrativo</h2>
          <p>Ingresa tus credenciales para acceder al CRM.</p>
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

  // Cálculos para las tarjetas
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => (l.status || 'nuevo') === 'nuevo').length;
  const closedLeads = leads.filter(l => l.status === 'ganado').length;

  return (
    <div className="crm-dashboard">
      <header className="crm-header glass-panel">
        <h1>AutoScale <span className="text-gradient">CRM</span></h1>
        <button className="btn btn-secondary" onClick={handleLogout}>Salir</button>
      </header>

      <div className="crm-metrics">
        <div className="glass-panel metric-card">
          <h3>Total Leads</h3>
          <p className="metric-value">{totalLeads}</p>
        </div>
        <div className="glass-panel metric-card">
          <h3>Nuevos (Sin contactar)</h3>
          <p className="metric-value text-gradient">{newLeads}</p>
        </div>
        <div className="glass-panel metric-card">
          <h3>Ventas Cerradas</h3>
          <p className="metric-value" style={{ color: 'var(--accent-tertiary)' }}>{closedLeads}</p>
        </div>
      </div>

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
          <button className="btn btn-secondary btn-export" onClick={exportToExcel} disabled={filteredLeads.length === 0}>
            📥 Exportar Excel
          </button>
        </div>
      </div>

      <div className="glass-panel crm-table-container">
        <div className="crm-table-header">
          <h2>Registro de Clientes ({filteredLeads.length})</h2>
          <button className="btn btn-primary" onClick={fetchLeads}>↻ Refrescar</button>
        </div>

        {loading ? (
          <p className="text-center" style={{ padding: '2rem' }}>Cargando clientes...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-center" style={{ padding: '2rem' }}>No se encontraron clientes con estos filtros.</p>
        ) : (
          <div className="table-wrapper">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
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
                    <td>{lead.servicio}</td>
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
                        title="Enviar WhatsApp"
                      >
                        💬 WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCRM;
