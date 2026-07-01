import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import AdminCRM from './components/AdminCRM';
import PortfolioPage from './components/PortfolioPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminCRM />} />
        <Route path="/portafolio" element={<PortfolioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
