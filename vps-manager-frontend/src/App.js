import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Views
import DashboardView from './views/DashboardView';
import SystemView from './views/SystemView';
import HardwareView from './views/HardwareView';
import NetworkView from './views/NetworkView';
import ServicesView from './views/ServicesView';

// Hooks
import { useApiStatus } from './hooks/useApiStatus';

// Constants
import { API_BASE } from './utils/constants';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const apiStatus = useApiStatus();

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
                  <AlertCircle className="h-5 w-5 text-red-400" />
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

export default App;