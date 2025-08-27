import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Views
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import SystemView from './views/SystemView';
import HardwareView from './views/HardwareView';
import NetworkView from './views/NetworkView';
import ServicesView from './views/ServicesView';

// Hooks
import { useApiStatus } from './hooks/useApiStatus';

// Constants
import { API_BASE } from './utils/constants';

// Composant pour l'app principale (après login)
const MainApp = ({ onLogout }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const apiStatus = useApiStatus();

  // Synchroniser activeView avec l'URL
  const [activeView, setActiveView] = useState(() => {
    const path = location.pathname.replace('/', '');
    return path || 'dashboard';
  });

  // Mettre à jour activeView quand l'URL change
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    const view = path || 'dashboard';
    setActiveView(view);
  }, [location.pathname]);

  // Mapping des vues
  const viewComponents = {
    dashboard: DashboardView,
    system: SystemView,
    hardware: HardwareView,
    network: NetworkView,
    services: ServicesView,
  };

  const ActiveComponent = viewComponents[activeView] || DashboardView;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
        apiStatus={apiStatus}
        onLogout={onLogout}
      />

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Zone de contenu */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Alerte API déconnectée */}
            {apiStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="h-5 w-5 text-red-400">⚠️</div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Connexion API impossible
                    </h3>
                    <p className="mt-2 text-sm text-red-700">
                      Vérifiez que l'API fonctionne sur {API_BASE}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Rendu de la vue active */}
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

// Composant de protection des routes
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Composant principal avec routing
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Vérifier si un token existe au démarrage
    return localStorage.getItem('authToken') !== null;
  });

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Route de login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginView onLogin={handleLogin} />
          } 
        />
        
        {/* Routes protégées - toutes utilisent MainApp mais avec des URLs différentes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainApp onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/system" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainApp onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/hardware" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainApp onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/network" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainApp onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/services" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainApp onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Route par défaut */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
        
        {/* Catch all - rediriger vers dashboard */}
        <Route 
          path="*" 
          element={<Navigate to="/dashboard" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;