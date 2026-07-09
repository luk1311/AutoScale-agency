import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Save, Trash2, Image as ImageIcon, CheckCircle2, Loader2,
  Upload, ExternalLink, Eye, EyeOff,
} from 'lucide-react';
import './PortfolioEditor.css';

// Etiquetas del stack real de AutoScale (lo que de verdad vendemos).
const SUGGESTED_TAGS = ['React', 'Supabase', 'n8n', 'WhatsApp', 'IA', 'CRM', 'Landing', 'Automatización', 'SEO'];

const CATEGORIES = ['Desarrollo Web', 'IA & Automatización', 'CRM', 'E-commerce', 'Otros'];

const MAX_IMAGE_MB = 4;

const PortfolioEditor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dirty, setDirty] = useState(false);
  const fileInputRef = useRef(null);

  const [activeProject, setActiveProject] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchProjects = async () => {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambiar de proyecto con cambios sin guardar pide confirmación.
  const guardDirty = () => {
    if (!dirty) return true;
    return window.confirm('Tienes cambios sin guardar. ¿Descartarlos?');
  };

  const resetFileState = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateNew = () => {
    if (!guardDirty()) return;
    setActiveProject({
      id: 'new',
      title: 'Nuevo Proyecto',
      category: 'Desarrollo Web',
      description: '',
      image: '',
      tags: [],
      website_url: '',
      full_content: '',
      metrics: [],
      is_active: false,
    });
    resetFileState();
    setDirty(true);
  };

  const handleProjectSelect = (project) => {
    if (activeProject?.id === project.id) return;
    if (!guardDirty()) return;
    setActiveProject(project);
    resetFileState();
    setDirty(false);
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      showToast(`La imagen supera ${MAX_IMAGE_MB}MB — usa una más liviana`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!activeProject.title || !activeProject.title.trim()) {
      showToast('El título es obligatorio');
      return;
    }
    if (!activeProject.image && !selectedFile) {
      showToast('El proyecto necesita una imagen');
      return;
    }

    setSaving(true);
    let finalImageUrl = activeProject.image;

    if (selectedFile) {
      setUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio_images')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError);
        showToast('Error al subir la imagen (revisa el Storage de Supabase)');
        setSaving(false);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio_images')
        .getPublicUrl(fileName);

      finalImageUrl = publicUrl;

      if (activeProject.image) {
        await deleteStorageImage(activeProject.image);
      }
      setUploading(false);
    }

    // eslint-disable-next-line no-unused-vars
    const { id, _rawTags, ...projectData } = activeProject;
    projectData.image = finalImageUrl;

    if (id === 'new') {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert([projectData])
        .select();

      if (error) {
        console.error('Error insertando:', error);
        showToast('Error al guardar el proyecto');
      } else {
        showToast('Proyecto creado ✓');
        setProjects([data[0], ...projects]);
        setActiveProject(data[0]);
        setDirty(false);
      }
    } else {
      const { error } = await supabase
        .from('portfolio_projects')
        .update(projectData)
        .eq('id', id);

      if (error) {
        console.error('Error actualizando:', error);
        showToast('Error al actualizar el proyecto');
      } else {
        showToast('Cambios guardados ✓');
        setProjects(projects.map(p => p.id === id ? { ...activeProject, image: finalImageUrl } : p));
        setActiveProject(prev => ({ ...prev, image: finalImageUrl }));
        setDirty(false);
      }
    }

    resetFileState();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (id === 'new') {
      setActiveProject(projects[0] || null);
      resetFileState();
      setDirty(false);
      return;
    }

    if (!window.confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return;
    }

    const projectToDelete = projects.find(p => p.id === id);

    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando:', error);
      showToast('Error al eliminar');
    } else {
      if (projectToDelete && projectToDelete.image) {
        await deleteStorageImage(projectToDelete.image);
      }
      showToast('Proyecto eliminado');
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      setActiveProject(filtered.length > 0 ? filtered[0] : null);
      setDirty(false);
    }
  };

  const updateField = (field, value) => {
    setActiveProject(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(',').map(t => t.trim()).filter(t => t !== '');
    setActiveProject(prev => ({ ...prev, tags: tagsArray, _rawTags: value }));
    setDirty(true);
  };

  const handleAddSuggestedTag = (tag) => {
    const currentTags = activeProject.tags || [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      setActiveProject(prev => ({ ...prev, tags: newTags, _rawTags: newTags.join(', ') }));
      setDirty(true);
    }
  };

  const addMetric = () => {
    updateField('metrics', [...(activeProject.metrics || []), { value: '', label: '' }]);
  };

  const updateMetric = (index, field, value) => {
    const newMetrics = [...(activeProject.metrics || [])];
    newMetrics[index][field] = value;
    updateField('metrics', newMetrics);
  };

  const removeMetric = (index) => {
    const newMetrics = [...(activeProject.metrics || [])];
    newMetrics.splice(index, 1);
    updateField('metrics', newMetrics);
  };

  // Si el proyecto trae una categoría vieja que ya no ofrecemos, se conserva en la lista.
  const categoryOptions = activeProject && activeProject.category && !CATEGORIES.includes(activeProject.category)
    ? [activeProject.category, ...CATEGORIES]
    : CATEGORIES;

  if (loading) {
    return (
      <div className="pf-loading glass-panel">
        <Loader2 className="animate-spin" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <p>Cargando portafolio…</p>
      </div>
    );
  }

  return (
    <>
      {/* Barra de proyectos — mismo lenguaje que la toolbar del CRM */}
      <div className="pf-bar glass-panel">
        <div className="pf-bar-info">
          <h2>Portafolio</h2>
          <span>Los proyectos publicados aparecen en tu web</span>
        </div>
        <div className="pf-chips">
          {activeProject?.id === 'new' && (
            <button className="pf-chip active" type="button">
              <span className="pf-dot draft" />
              Nuevo proyecto
            </button>
          )}
          {projects.map(project => (
            <button
              key={project.id}
              type="button"
              className={`pf-chip ${activeProject?.id === project.id ? 'active' : ''}`}
              onClick={() => handleProjectSelect(project)}
            >
              <span className={`pf-dot ${project.is_active ? 'live' : 'draft'}`} />
              {project.title}
            </button>
          ))}
        </div>
        <button className="btn btn-primary pf-new" onClick={handleCreateNew}>
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {activeProject ? (
        <div className="pf-editor glass-panel">
          {/* Cabecera del editor — como la de la tabla de leads */}
          <div className="pf-editor-head">
            <div className="pf-editor-title">
              <h3>{activeProject.id === 'new' ? 'Crear proyecto' : activeProject.title}</h3>
              <div className="pf-badges">
                <span className={`pf-state ${activeProject.is_active ? 'live' : 'draft'}`}>
                  {activeProject.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                  {activeProject.is_active ? 'Publicado' : 'Borrador'}
                </span>
                {dirty && <span className="pf-state dirty">● Cambios sin guardar</span>}
              </div>
            </div>
            <div className="pf-actions">
              {activeProject.website_url && (
                <a
                  className="btn btn-secondary pf-btn"
                  href={activeProject.website_url.startsWith('http') ? activeProject.website_url : `https://${activeProject.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={15} /> Ver en la web
                </a>
              )}
              <button className="btn btn-secondary pf-btn pf-danger" onClick={() => handleDelete(activeProject.id)}>
                <Trash2 size={15} /> Eliminar
              </button>
              <button className="btn btn-primary pf-btn" onClick={handleSave} disabled={saving || uploading}>
                {(saving || uploading)
                  ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Save size={15} />}
                {uploading ? 'Subiendo imagen…' : saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>

          {/* Cuerpo: formulario + vista previa en el MISMO panel */}
          <div className="pf-body">
            <div className="pf-form">
              <div className="pf-row">
                <div className="pf-field">
                  <label>Título del proyecto *</label>
                  <input
                    type="text"
                    value={activeProject.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Ej. Nail Studio — agenda por WhatsApp"
                  />
                </div>
                <div className="pf-field">
                  <label>Categoría</label>
                  <select
                    value={activeProject.category}
                    onChange={(e) => updateField('category', e.target.value)}
                  >
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pf-field">
                <label>Descripción corta</label>
                <textarea
                  value={activeProject.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Qué problema resolviste y qué logró el cliente…"
                  rows="3"
                />
              </div>

              <div className="pf-row">
                <div className="pf-field">
                  <label>Imagen (recomendado 800×600) *</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="pf-file-hidden"
                    id="pf-file-upload"
                  />
                  <label htmlFor="pf-file-upload" className="pf-upload">
                    <Upload size={16} />
                    {selectedFile ? selectedFile.name : activeProject.image ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  </label>
                </div>
                <div className="pf-field">
                  <label>Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    value={activeProject._rawTags !== undefined ? activeProject._rawTags : (activeProject.tags || []).join(', ')}
                    onChange={handleTagsChange}
                    placeholder="React, Supabase, WhatsApp…"
                  />
                  <div className="pf-suggestions">
                    {SUGGESTED_TAGS.map(tag => (
                      <button key={tag} type="button" className="pf-tag-suggest" onClick={() => handleAddSuggestedTag(tag)}>
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="pf-toggle">
                <input
                  type="checkbox"
                  checked={activeProject.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                />
                <span>
                  <strong>Visible al público</strong>
                  <em>Si está desactivado, no aparece en tu web ni en el portafolio.</em>
                </span>
              </label>

              <div className="pf-divider">
                <span>Detalles adicionales</span>
              </div>

              <div className="pf-field">
                <label>Enlace del sitio en vivo (opcional)</label>
                <input
                  type="text"
                  value={activeProject.website_url || ''}
                  onChange={(e) => updateField('website_url', e.target.value)}
                  placeholder="https://cliente.vercel.app"
                />
              </div>

              <div className="pf-field">
                <div className="pf-metrics-head">
                  <label>Métricas destacadas</label>
                  <button className="btn btn-secondary pf-btn" onClick={addMetric} type="button">
                    <Plus size={14} /> Añadir
                  </button>
                </div>
                {(!activeProject.metrics || activeProject.metrics.length === 0) && (
                  <p className="pf-hint">Ej. “+40 citas/mes” o “respuesta en 1 min”. Los números venden.</p>
                )}
                {(activeProject.metrics || []).map((metric, index) => (
                  <div key={index} className="pf-metric-row">
                    <input
                      type="text"
                      className="pf-metric-value"
                      value={metric.value}
                      onChange={(e) => updateMetric(index, 'value', e.target.value)}
                      placeholder="+40"
                    />
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => updateMetric(index, 'label', e.target.value)}
                      placeholder="citas al mes"
                    />
                    <button className="pf-metric-del" onClick={() => removeMetric(index)} title="Quitar" type="button">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Vista previa en vivo (misma tarjeta que la web) */}
            <aside className="pf-preview">
              <span className="pf-preview-label">Así se ve en tu web</span>
              <div className="pf-card">
                <div className="pf-card-img">
                  {(previewUrl || activeProject.image) ? (
                    <img src={previewUrl || activeProject.image} alt="Vista previa" />
                  ) : (
                    <div className="pf-card-placeholder"><ImageIcon size={28} /> Sin imagen</div>
                  )}
                  {activeProject.is_active && <span className="pf-card-live">● En vivo</span>}
                </div>
                <div className="pf-card-body">
                  <span className="pf-card-cat">{activeProject.category || 'Categoría'}</span>
                  <h4>{activeProject.title || 'Título del proyecto'}</h4>
                  <p>{activeProject.description || 'La descripción corta aparecerá aquí.'}</p>
                  <div className="pf-card-tags">
                    {(activeProject.tags || []).slice(0, 3).map((tag, i) => (
                      <span key={i}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <div className="pf-editor glass-panel pf-empty">
          <ImageIcon size={42} />
          <h3>Crea tu primer proyecto</h3>
          <p>Los casos que publiques aquí aparecen automáticamente en tu web.</p>
          <button className="btn btn-primary" onClick={handleCreateNew}><Plus size={16} /> Nuevo proyecto</button>
        </div>
      )}

      {toastMessage && (
        <div className="crm-toast">
          <CheckCircle2 size={20} />
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default PortfolioEditor;
