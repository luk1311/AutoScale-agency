import { useEffect, useState } from 'react';
import { trackViewContent } from '../lib/metaPixel';
import Header from './Header';
import Hero from './Hero';
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

      <FooterCTA openModal={openModal} />
    </div>
  );
};

export default Landing;
