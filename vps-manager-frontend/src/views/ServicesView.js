import React, { useState } from 'react';
import { Settings, Play, Square, RotateCcw, Activity, AlertCircle } from 'lucide-react';
import apiService from '../services/api';
import { SERVICE_ACTIONS } from '../utils/constants';

const ServicesView = () => {
  const [serviceName, setServiceName] = useState('');
  const [action, setAction] = useState(SERVICE_ACTIONS.STATUS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleServiceAction = async () => {
    if (!serviceName.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await apiService.manageService(serviceName.trim(), action);
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.message || 'Erreur de connexion à l\'API'
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case SERVICE_ACTIONS.START:
        return <Play className="mr-2 h-4 w-4" />;
      case SERVICE_ACTIONS.STOP:
        return <Square className="mr-2 h-4 w-4" />;
      case SERVICE_ACTIONS.RESTART:
        return <RotateCcw className="mr-2 h-4 w-4" />;
      default:
        return <Activity className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Services</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contrôle des services */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="mr-2 h-5 w-5 text-green-500" />
            Contrôle des Services
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du service
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="nginx, apache2, mysql..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={SERVICE_ACTIONS.STATUS}>Vérifier le statut</option>
                <option value={SERVICE_ACTIONS.START}>Démarrer</option>
                <option value={SERVICE_ACTIONS.STOP}>Arrêter</option>
                <option value={SERVICE_ACTIONS.RESTART}>Redémarrer</option>
              </select>
            </div>

            <button
              onClick={handleServiceAction}
              disabled={loading || !serviceName.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  {getActionIcon()}
                  Exécuter
                </>
              )}
            </button>
          </div>

          {result && (
            <div className={`mt-4 p-4 rounded-md ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {result.success ? (
                  <Activity className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Succès' : 'Erreur'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message || result.output || result.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste des services */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Services Système</h3>
          <div className="text-gray-500 text-center py-8">
            Liste des services installés
            <br />
            <small className="text-xs">(Endpoint: GET /services/list)</small>
          </div>
        </div>

        {/* Services courants */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Services Courants</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['nginx', 'apache2', 'mysql', 'postgresql', 'redis', 'docker', 'ssh', 'ufw'].map(service => (
              <button
                key={service}
                onClick={() => setServiceName(service)}
                className="p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{service}</div>
                <div className="text-xs text-gray-500">Cliquer pour sélectionner</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;