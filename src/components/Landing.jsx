import { useEffect, useState } from 'react';
import { trackViewContent } from '../lib/metaPixel';
import Header from './Header';
import Hero from './Hero';
import Services from './Services';
import Portfolio from './Portfolio';
import Process from './Process';
import UseCases from './UseCases';
import Pricing from './Pricing';
import FAQ from './FAQ';
import FooterCTA from './FooterCTA';

const Landing = () => {
  useEffect(() => {
    trackViewContent({ content_name: 'Landing V2' });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header openModal={openModal} />
      
      <Hero openModal={openModal} />
      <Services openModal={openModal} />
      <Portfolio openModal={openModal} />
      <Process />
      <UseCases />
      <Pricing openModal={openModal} />
      <FAQ />

      <FooterCTA openModal={openModal} />
    </div>
  );
};

export default Landing;
