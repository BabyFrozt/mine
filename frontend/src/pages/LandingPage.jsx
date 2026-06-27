import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Mission from '../components/landing/Mission';
import OctSection from '../components/landing/OctSection';
import Artefacts from '../components/landing/Artefacts';
import EquipmentSection from '../components/landing/EquipmentSection';
import AboutSection from '../components/landing/AboutSection';
import Marketplace from '../components/landing/Marketplace';
import Footer from '../components/landing/Footer';
import AuthModal from '../components/landing/AuthModal';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const { player } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'MINES BLOCK · Excavate. Protect. Profit.';
  }, []);

  const handlePlay = () => {
    if (player) navigate('/play');
    else setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar onLoginClick={() => setAuthOpen(true)} onPlayClick={handlePlay} />
      <Hero onPlayClick={handlePlay} />
      <Mission />
      <OctSection />
      <Artefacts />
      <EquipmentSection />
      <AboutSection />
      <Marketplace />
      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
