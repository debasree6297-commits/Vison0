import React, { Suspense } from 'react';
import { Navigate, useLocation, Routes, Route, HashRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ChatStudioPage from './pages/ChatStudioPage';
import ImageStudioPage from './pages/ImageStudioPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import { AnimatePresence, motion } from 'framer-motion';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-default-bg-primary dark:bg-space-bg-primary">
        <div className="w-12 h-12 border-4 border-default-accent-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-default-text-secondary">Securing Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

// FIX: Made `children` prop optional to resolve a recurring TypeScript error where it fails to detect passed children, a pattern seen elsewhere in the project.
const PageWrapper = ({ children }: { children?: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/signin" element={<PageWrapper><SignInPage /></PageWrapper>} />
        <Route path="/auth/callback" element={<PageWrapper><AuthCallbackPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route
          path="/chat-studio"
          element={<ProtectedRoute><PageWrapper><ChatStudioPage /></PageWrapper></ProtectedRoute>}
        />
        <Route
          path="/image-studio"
          element={<ProtectedRoute><PageWrapper><ImageStudioPage /></PageWrapper></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><PageWrapper><SettingsPage /></PageWrapper></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <div className="bg-default-bg-primary dark:bg-space-bg-primary text-default-text-primary dark:text-space-text-primary min-h-screen transition-colors duration-400 relative">
            <Header />
            <Suspense fallback={
              <div className="h-screen w-full flex items-center justify-center">
                <div className="animate-pulse text-default-accent-gold font-bold">Initializing Vision...</div>
              </div>
            }>
              <AnimatedRoutes />
            </Suspense>
          </div>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;