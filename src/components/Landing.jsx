import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import Solution from './Solution';
import Pricing from './Pricing';
import Portfolio from './Portfolio';
import Process from './Process';
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
      <Solution />
      <Pricing openModal={openModal} />
      <Portfolio openModal={openModal} />
      <div id="proceso">
        <Process />
      </div>
      <FAQ />
      <FooterCTA openModal={openModal} />
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </div>
  );
};

export default Landing;
