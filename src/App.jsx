import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Landing from './components/Landing';

// Lazy load heavy components
const AdminCRM = lazy(() => import('./components/AdminCRM'));
const PortfolioPage = lazy(() => import('./components/PortfolioPage'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
import './App.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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
