import React from 'react';
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
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Hero />
      <PainPoints />
      <Solution />
      <Comparison />
      <TechStack />
      <Demo />
      <Process />
      <UseCases />
      <FAQ />
      <FooterCTA />
    </div>
  );
}

export default App;
