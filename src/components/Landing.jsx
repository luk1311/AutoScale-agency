import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import PainPoints from './PainPoints';
import Stats from './Stats';
import Services from './Services';
import Portfolio from './Portfolio';
import Solution from './Solution';
import Comparison from './Comparison';
import TechStack from './TechStack';
import Process from './Process';
import UseCases from './UseCases';
import FAQ from './FAQ';
import FooterCTA from './FooterCTA';
import ContactModal from './ContactModal';
import { trackViewContent } from '../lib/metaPixel';

const Landing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    trackViewContent({ content_name: 'Contacto' });
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-container">
      <Header openModal={openModal} />
      <Hero openModal={openModal} />
      <PainPoints />
      <Stats />
      <Services />
      <Portfolio openModal={openModal} />
      <Comparison />
      <TechStack />
      <div id="proceso">
        <Process />
      </div>
      <div id="casos">
        <UseCases />
      </div>
      <FAQ />
      <FooterCTA openModal={openModal} />
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </div>
  );
};

export default Landing;
