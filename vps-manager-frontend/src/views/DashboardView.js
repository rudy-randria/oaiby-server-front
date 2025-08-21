import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, HardDrive, Wifi, Settings, BarChart3 } from 'lucide-react';
import apiService from '../services/api';
import LoadingCard from '../components/UI/LoadingCard';
import { REFRESH_INTERVAL } from '../utils/constants';

const DashboardView = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiService.getSystemMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Erreur métriques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Statut Système */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Statut Système</p>
              <p className={`text-2xl font-bold ${
                metrics?.status === 'OK' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics?.status || 'N/A'}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* CPU */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisation CPU</p>
              <p className="text-2xl font-bold text-blue-600">
                {metrics?.cpu || 'N/A'}
              </p>
            </div>
            <Cpu className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Mémoire */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mémoire</p>
              <p className="text-2xl font-bold text-purple-600">
                {metrics?.memory || 'N/A'}
              </p>
            </div>
            <Server className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Disque */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Espace Disque</p>
              <p className="text-2xl font-bold text-orange-600">
                {metrics?.disk || 'N/A'}
              </p>
            </div>
            <HardDrive className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        {/* Réseau */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connexions</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <Wifi className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services</p>
              <p className="text-2xl font-bold text-indigo-600">Running</p>
            </div>
            <Settings className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Graphique simplifié */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activité Système</h3>
        <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
          <BarChart3 className="h-12 w-12 text-gray-400" />
          <span className="ml-3 text-gray-500">Graphiques en temps réel (à implémenter)</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;