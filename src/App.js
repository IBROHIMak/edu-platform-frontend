import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPageSimple';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import OfflineIndicator from './components/OfflineIndicator';
import TestLogin from './TestLogin'; // Import test component
import { preloadOfflineData } from './utils/offlineApi';

function App() {
  useEffect(() => {
    // Service Worker ni ro'yxatdan o'tkazish
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered: ', registration);
            
            // Offline ma'lumotlarni oldindan yuklash
            preloadOfflineData();
          })
          .catch((registrationError) => {
            console.log('❌ SW registration failed: ', registrationError);
          });
      });
    }

    // PWA install prompt
    let deferredPrompt;
    const installPrompt = document.getElementById('pwa-install-prompt');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('💾 PWA install prompt available');
      e.preventDefault();
      deferredPrompt = e;
      
      // Install prompt ni ko'rsatish
      if (installPrompt) {
        installPrompt.style.display = 'block';
      }
    });

    // Install button click handler
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`👤 User response to install prompt: ${outcome}`);
          deferredPrompt = null;
          
          if (installPrompt) {
            installPrompt.style.display = 'none';
          }
        }
      });
    }

    // Dismiss button click handler
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        if (installPrompt) {
          installPrompt.style.display = 'none';
        }
      });
    }

    // PWA o'rnatilgandan keyin
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA was installed');
      if (installPrompt) {
        installPrompt.style.display = 'none';
      }
    });

    // Cleanup
    return () => {
      if (installBtn) {
        installBtn.removeEventListener('click', () => {});
      }
      if (dismissBtn) {
        dismissBtn.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors">
                <OfflineIndicator />
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/test-login" element={<TestLogin />} />
                  <Route
                    path="/student/*"
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/teacher/*"
                    element={
                      <ProtectedRoute allowedRoles={['teacher']}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/parent/*"
                    element={
                      <ProtectedRoute allowedRoles={['parent']}>
                        <ParentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                    },
                  }}
                />
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;