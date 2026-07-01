import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Save, Trash2, Image as ImageIcon, CheckCircle2, Loader2, Upload } from 'lucide-react';
import './PortfolioEditor.css';

const PortfolioEditor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  // Selected project for editing
  const [activeProject, setActiveProject] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
      if (data && data.length > 0 && !activeProject) {
        setActiveProject(data[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateNew = () => {
    setActiveProject({
      id: 'new',
      title: 'Nuevo Proyecto',
      category: 'Desarrollo Web',
      description: '',
      image: '',
      tags: [],
      is_active: false
    });
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProjectSelect = (project) => {
    setActiveProject(project);
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper function to extract file path from public URL
  const getStoragePathFromUrl = (url) => {
    if (!url || !url.includes('supabase.co/storage/v1/object/public/portfolio_images/')) return null;
    return url.split('portfolio_images/')[1];
  };

  const deleteStorageImage = async (url) => {
    const path = getStoragePathFromUrl(url);
    if (path) {
      await supabase.storage.from('portfolio_images').remove([path]);
    }
  };

  const handleSave = async () => {
    if (!activeProject.title) {
      alert("El título es obligatorio");
      return;
    }
    
    setSaving(true);
    let finalImageUrl = activeProject.image;

    // Subir la imagen si hay una nueva seleccionada
    if (selectedFile) {
      setUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio_images')
        .upload(fileName, selectedFile);
        
      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError);
        alert('Error al subir la imagen. Revisa los permisos del Storage en Supabase.');
        setSaving(false);
        setUploading(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio_images')
        .getPublicUrl(fileName);
        
      finalImageUrl = publicUrl;
      
      // Borrar imagen anterior si existía en storage
      if (activeProject.image) {
        await deleteStorageImage(activeProject.image);
      }
      setUploading(false);
    } else if (!activeProject.image && !selectedFile) {
      alert("Debes seleccionar una imagen para el proyecto.");
      setSaving(false);
      return;
    }

    const { id, ...projectData } = activeProject;
    projectData.image = finalImageUrl;

    if (id === 'new') {
      // Insert
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert([projectData])
        .select();

      if (error) {
        console.error('Error insertando:', error);
        alert("Error al guardar el proyecto");
      } else {
        showToast('Proyecto creado exitosamente');
        setProjects([data[0], ...projects]);
        setActiveProject(data[0]);
      }
    } else {
      // Update
      const { error } = await supabase
        .from('portfolio_projects')
        .update(projectData)
        .eq('id', id);

      if (error) {
        console.error('Error actualizando:', error);
        alert("Error al actualizar el proyecto");
      } else {
        showToast('Proyecto actualizado');
        setProjects(projects.map(p => p.id === id ? { ...activeProject, image: finalImageUrl } : p));
      }
    }
    
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (id === 'new') {
      setActiveProject(projects[0] || null);
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return;
    }
    
    // Encontrar el proyecto para borrar su imagen
    const projectToDelete = projects.find(p => p.id === id);

    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando:', error);
      alert("Error al eliminar");
    } else {
      // Borrar la imagen de storage
      if (projectToDelete && projectToDelete.image) {
        await deleteStorageImage(projectToDelete.image);
      }
      
      showToast('Proyecto eliminado');
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      setActiveProject(filtered.length > 0 ? filtered[0] : null);
    }
  };

  const updateField = (field, value) => {
    setActiveProject(prev => ({ ...prev, [field]: value }));
  };

  // Helper para manejar el input de tags (separado por comas a array)
  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(',').map(t => t.trim()).filter(t => t !== '');
    updateField('tags', tagsArray);
  };

  if (loading) {
    return (
      <div className="portfolio-editor-loading">
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
        <p>Cargando portafolio...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-editor-container">
      {/* Sidebar: Lista de proyectos */}
      <div className="portfolio-sidebar glass-panel">
        <div className="portfolio-sidebar-header">
          <h3>Tus Proyectos</h3>
          <button className="btn btn-primary btn-sm" onClick={handleCreateNew}>
            <Plus size={16} /> Nuevo
          </button>
        </div>
        
        <div className="portfolio-list">
          {projects.length === 0 && activeProject?.id !== 'new' && (
            <p className="portfolio-empty text-muted">No tienes proyectos aún.</p>
          )}
          
          {activeProject?.id === 'new' && (
            <div className={`portfolio-list-item active`}>
              <span className="status-dot draft"></span>
              <div className="portfolio-list-info">
                <strong>Nuevo Proyecto</strong>
                <span>Sin guardar</span>
              </div>
            </div>
          )}

          {projects.map(project => (
            <div 
              key={project.id} 
              className={`portfolio-list-item ${activeProject?.id === project.id ? 'active' : ''}`}
              onClick={() => handleProjectSelect(project)}
            >
              <span className={`status-dot ${project.is_active ? 'active' : 'draft'}`}></span>
              <div className="portfolio-list-info">
                <strong>{project.title}</strong>
                <span>{project.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor principal (Formulario) */}
      <div className="portfolio-main glass-panel">
        {activeProject ? (
          <>
            <div className="portfolio-main-header">
              <h2>{activeProject.id === 'new' ? 'Crear Proyecto' : 'Editar Proyecto'}</h2>
              <div className="portfolio-actions">
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => handleDelete(activeProject.id)}
                  style={{ color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.3)' }}
                >
                  <Trash2 size={16} /> Eliminar
                </button>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={handleSave}
                  disabled={saving || uploading}
                >
                  {(saving || uploading) ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                  {uploading ? 'Subiendo imagen...' : saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>

            <div className="portfolio-form">
              <div className="form-row two-cols">
                <div className="form-group">
                  <label>Título del Proyecto *</label>
                  <input 
                    type="text" 
                    value={activeProject.title} 
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Ej. E-commerce Escalable"
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select 
                    value={activeProject.category} 
                    onChange={(e) => updateField('category', e.target.value)}
                  >
                    <option value="Desarrollo Web">Desarrollo Web</option>
                    <option value="IA & Automatización">IA & Automatización</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción corta</label>
                <textarea 
                  value={activeProject.description} 
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe brevemente los logros o la solución aportada..."
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row two-cols">
                <div className="form-group">
                  <label>Imagen del Proyecto (Recomendado: 800x600px) *</label>
                  <div className="file-upload-wrapper">
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="file-input-hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-button">
                      <Upload size={18} /> Seleccionar Imagen Local
                    </label>
                    <span className="file-upload-name">
                      {selectedFile ? selectedFile.name : activeProject.image ? "Imagen actual cargada" : "Ningún archivo seleccionado"}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Etiquetas (separadas por coma)</label>
                  <input 
                    type="text" 
                    value={(activeProject.tags || []).join(', ')} 
                    onChange={handleTagsChange}
                    placeholder="Shopify, React, Klaviyo..."
                  />
                </div>
              </div>

              <div className="form-group toggle-group">
                <label className="toggle-label">
                  <input 
                    type="checkbox" 
                    checked={activeProject.is_active} 
                    onChange={(e) => updateField('is_active', e.target.checked)}
                  />
                  <span className="toggle-text">
                    <strong>Visible al público</strong>
                    <span className="text-muted text-small">Si está desactivado, no aparecerá en tu landing page ni portafolio.</span>
                  </span>
                </label>
              </div>

              {/* Preview de la tarjeta */}
              <div className="portfolio-preview-box">
                <p className="preview-label">Vista Previa de Tarjeta:</p>
                <div className="portfolio-card-mini">
                  <div className="portfolio-image-wrapper-mini">
                    {(previewUrl || activeProject.image) ? (
                      <img src={previewUrl || activeProject.image} alt="Preview" />
                    ) : (
                      <div className="placeholder-image">Sin Imagen</div>
                    )}
                  </div>
                  <div className="portfolio-content-mini">
                    <span className="portfolio-category-mini">{activeProject.category || 'Categoría'}</span>
                    <h3 className="portfolio-title-mini">{activeProject.title || 'Título del Proyecto'}</h3>
                    <p className="portfolio-description-mini">{activeProject.description || 'Descripción del proyecto...'}</p>
                    <div className="portfolio-tags-mini">
                      {(activeProject.tags || []).slice(0, 3).map((tag, i) => (
                        <span className="portfolio-tag-mini" key={i}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="portfolio-empty-state">
            <ImageIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Selecciona o crea un proyecto</h3>
            <p className="text-muted">Gestiona el contenido de tu portafolio desde aquí.</p>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="crm-toast">
          <CheckCircle2 color="var(--accent-tertiary)" size={20} />
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default PortfolioEditor;
