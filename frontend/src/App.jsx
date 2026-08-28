import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceProvider } from './context/VoiceContext';
import { LocationProvider } from './context/LocationContext';
import { OfflineProvider } from './context/OfflineContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  useEffect(() => {
    // Register Service Worker for PWA offline capabilities
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('AGRIMIND PWA service worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('Service worker registration failed:', err);
          });
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <OfflineProvider>
          <LanguageProvider>
            <VoiceProvider>
              <LocationProvider>
                <AuthProvider>
                  <ToastProvider>
                    <AppRoutes />
                  </ToastProvider>
                </AuthProvider>
              </LocationProvider>
            </VoiceProvider>
          </LanguageProvider>
        </OfflineProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
