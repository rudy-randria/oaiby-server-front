import React from 'react';
import { Thermometer, Activity, Zap, Fan } from 'lucide-react';

const HardwareView = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Monitoring Hardware</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Thermometer className="mr-2 h-5 w-5 text-red-500" />
            Températures
          </h3>
          <div className="text-gray-500 text-center py-8">
            Température CPU, GPU, disques
            <br />
            <small className="text-xs">(Endpoint: GET /hardware/temperature)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-purple-500" />
            Capteurs
          </h3>
          <div className="text-gray-500 text-center py-8">
            Capteurs système disponibles
            <br />
            <small className="text-xs">(Endpoint: GET /hardware/sensors)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Fan className="mr-2 h-5 w-5 text-blue-500" />
            Ventilateurs
          </h3>
          <div className="text-gray-500 text-center py-8">
            Vitesse des ventilateurs
            <br />
            <small className="text-xs">(Endpoint: GET /hardware/fans)</small>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Alimentation
          </h3>
          <div className="text-gray-500 text-center py-8">
            Voltages et consommation
            <br />
            <small className="text-xs">(Endpoint: GET /hardware/power)</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareView;