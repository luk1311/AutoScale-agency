import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';

// Lazy load heavy components
const AdminCRM = lazy(() => import('./components/AdminCRM'));
const PortfolioPage = lazy(() => import('./components/PortfolioPage'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
import './App.css';

// Scroll nativo (sin Lenis): preciso e instantáneo, como Linear/Vercel.
// El desplazamiento suave SOLO aplica a los anclas (#casos, #precios) vía
// `scroll-behavior: smooth` en index.css.
function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-main)'}}>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminCRM />} />
          <Route path="/portafolio" element={<PortfolioPage />} />
          <Route path="/portafolio/:id" element={<ProjectDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
