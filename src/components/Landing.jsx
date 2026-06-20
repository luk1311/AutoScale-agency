import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import PainPoints from './PainPoints';
import Solution from './Solution';
import Comparison from './Comparison';
import TechStack from './TechStack';
import Demo from './Demo';
import Process from './Process';
import UseCases from './UseCases';
import FAQ from './FAQ';
import FooterCTA from './FooterCTA';
import ContactModal from './ContactModal';

const Landing = () => {
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
};

export default Landing;
