import { API_BASE } from '../utils/constants';

class ApiService {
  // Vérifier le statut de l'API
  async checkApiStatus() {
    try {
      const response = await fetch(`${API_BASE}/`);
      return await response.json();
    } catch (error) {
      throw new Error('API non accessible');
    }
  }

  // Récupérer les métriques système
  async getSystemMetrics() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des métriques');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Gérer un service
  async manageService(serviceName, action) {
    try {
      const response = await fetch(`${API_BASE}/services/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_name: serviceName,
          action: action
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de la gestion du service');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les informations système (à implémenter côté API)
  async getSystemInfo() {
    try {
      const response = await fetch(`${API_BASE}/system/info`);
      if (!response.ok) throw new Error('Endpoint non disponible');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les informations hardware (à implémenter côté API)
  async getHardwareInfo() {
    try {
      const response = await fetch(`${API_BASE}/hardware/sensors`);
      if (!response.ok) throw new Error('Endpoint non disponible');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les informations réseau (à implémenter côté API)
  async getNetworkInfo() {
    try {
      const response = await fetch(`${API_BASE}/network/interfaces`);
      if (!response.ok) throw new Error('Endpoint non disponible');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();