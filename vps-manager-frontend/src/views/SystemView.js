import React from 'react';
import { Monitor, Users } from 'lucide-react';

const SystemView = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Informations Système</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Monitor className="mr-2 h-5 w-5 text-blue-500" />
            Processus en cours
          </h3>
          <div className="text-gray-500 text-center py-8">
            Liste des processus système
            <br />
            <small className="text-xs">(Endpoint: GET /system/processes)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-green-500" />
            Utilisateurs connectés
          </h3>
          <div className="text-gray-500 text-center py-8">
            Sessions utilisateurs actives
            <br />
            <small className="text-xs">(Endpoint: GET /system/users)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Informations OS</h3>
          <div className="text-gray-500 text-center py-8">
            Version, uptime, kernel
            <br />
            <small className="text-xs">(Endpoint: GET /system/info)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Charges système</h3>
          <div className="text-gray-500 text-center py-8">
            Load average, nombre de processus
            <br />
            <small className="text-xs">(Endpoint: GET /system/load)</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemView;