import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Landing from './components/Landing';
import AdminCRM from './components/AdminCRM';
import PortfolioPage from './components/PortfolioPage';
import ProjectDetails from './components/ProjectDetails';
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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminCRM />} />
        <Route path="/portafolio" element={<PortfolioPage />} />
        <Route path="/portafolio/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
