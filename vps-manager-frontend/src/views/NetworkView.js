import React from 'react';
import { Wifi, Activity, Globe, Shield } from 'lucide-react';

const NetworkView = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Monitoring Réseau</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Wifi className="mr-2 h-5 w-5 text-blue-500" />
            Interfaces Réseau
          </h3>
          <div className="text-gray-500 text-center py-8">
            État des interfaces réseau
            <br />
            <small className="text-xs">(Endpoint: GET /network/interfaces)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-green-500" />
            Connexions Actives
          </h3>
          <div className="text-gray-500 text-center py-8">
            Connexions TCP/UDP en cours
            <br />
            <small className="text-xs">(Endpoint: GET /network/connections)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Globe className="mr-2 h-5 w-5 text-purple-500" />
            Statistiques Trafic
          </h3>
          <div className="text-gray-500 text-center py-8">
            Bande passante, paquets
            <br />
            <small className="text-xs">(Endpoint: GET /network/stats)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-red-500" />
            Ports Ouverts
          </h3>
          <div className="text-gray-500 text-center py-8">
            Services en écoute
            <br />
            <small className="text-xs">(Endpoint: GET /network/ports)</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkView;