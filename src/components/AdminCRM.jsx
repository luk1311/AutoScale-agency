import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import './AdminCRM.css';

const AdminCRM = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Autenticación simple
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  // Cargar leads desde Supabase
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const fetchLeads = async () => {
    setLoading(true);
    if (!supabase) {
      console.error('Supabase no está configurado');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  // Cambiar estado de un lead
  const updateLeadStatus = async (id, newStatus) => {
    if (!supabase) return;

    // Actualizar UI localmente primero para que se sienta instantáneo
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));

    // Actualizar en base de datos
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      // Revertir si hay error (opcional)
      fetchLeads();
    }
  };

  // Abrir WhatsApp
  const openWhatsApp = (lead) => {
    const text = `¡Hola ${lead.nombre.split(' ')[0]}! Soy de AutoScale Agency. Recibimos tu solicitud sobre "${lead.servicio}". ¿Cómo estás?`;
    window.open(`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
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

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    
    const headers = ['Fecha', 'Nombre', 'Correo', 'WhatsApp', 'Empresa', 'Servicio', 'Estado', 'Descripción'];
    
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => {
        return [
          formatDate(lead.created_at),
          `"${lead.nombre || ''}"`,
          `"${lead.correo || ''}"`,
          `"${lead.whatsapp || ''}"`,
          `"${lead.empresa || ''}"`,
          `"${lead.servicio || ''}"`,
          `"${lead.status || 'nuevo'}"`,
          `"${(lead.descripcion || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_autoscale_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="crm-login-container">
        <div className="glass-panel crm-login-box">
          <h2>🔐 Acceso Administrativo</h2>
          <p>Ingresa la contraseña maestra para acceder al CRM.</p>
          <form onSubmit={handleLogin} className="crm-login-form">
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Contraseña" 
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
        <button className="btn btn-secondary" onClick={() => setIsAuthenticated(false)}>Salir</button>
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
          <button className="btn btn-secondary btn-export" onClick={exportToCSV} disabled={filteredLeads.length === 0}>
            📥 Exportar CSV
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
                  <tr key={lead.id}>
                    <td>{formatDate(lead.created_at)}</td>
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
