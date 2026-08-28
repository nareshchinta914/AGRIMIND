import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Footer from '../components/common/Footer';
import OfflineIndicator from '../components/common/OfflineIndicator';
import FloatingVoiceButton from '../components/voice/FloatingVoiceButton';
import VoiceAssistantModal from '../components/voice/VoiceAssistantModal';
import CropCameraModal from '../components/camera/CropCameraModal';
import { useVoice } from '../hooks/useVoice';

const MainLayout = () => {
  const { isAssistantOpen, closeAssistant, isCameraOpen, closeCamera } = useVoice();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf7] text-slate-800 relative">
      <OfflineIndicator />
      {!isLanding && <Navbar />}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />

      {/* Global Farmer Voice & Vision Assistants */}
      <FloatingVoiceButton />
      <VoiceAssistantModal isOpen={isAssistantOpen} onClose={closeAssistant} />
      <CropCameraModal isOpen={isCameraOpen} onClose={closeCamera} />
    </div>
  );
};

export default MainLayout;
