import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Solution from './components/Solution';
import Comparison from './components/Comparison';
import TechStack from './components/TechStack';
import Demo from './components/Demo';
import Process from './components/Process';
import UseCases from './components/UseCases';
import FAQ from './components/FAQ';
import FooterCTA from './components/FooterCTA';
import ContactModal from './components/ContactModal';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-container">
      <Header openModal={openModal} />
      <Hero openModal={openModal} />
      <PainPoints />
      <Solution />
      <Comparison />
      <TechStack />
      <Demo openModal={openModal} />
      <Process />
      <UseCases />
      <FAQ />
      <FooterCTA openModal={openModal} />
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </div>
  );
}

export default App;
