import { API_BASE } from '../utils/constants';

class ApiService {
  constructor() {
    this.token = this.getStoredToken();
  }

  // ===============================
  // GESTION DES TOKENS
  // ===============================

  getStoredToken() {
    return localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  isTokenExpired() {
    const expiresAt = localStorage.getItem('token_expires');
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt);
  }

  // Obtenir les headers avec authentification
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token && !this.isTokenExpired()) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // ===============================
  // MÉTHODES D'AUTHENTIFICATION
  // ===============================

  // Connexion utilisateur
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Gestion des erreurs spécifiques
        if (response.status === 401) {
          throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
        } else if (response.status === 423) {
          throw new Error(`Compte verrouillé. ${data.detail || 'Réessayez plus tard.'}`);
        } else if (response.status === 403) {
          throw new Error('Compte désactivé. Contactez l\'administrateur.');
        } else {
          throw new Error(data.detail || 'Erreur de connexion');
        }
      }

      // Stocker le token et les informations
      this.setToken(data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      localStorage.setItem('token_expires', Date.now() + (data.expires_in * 1000));

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de contacter le serveur d\'authentification');
      }
      throw error;
    }
  }

  // Déconnexion utilisateur
  async logout() {
    try {
      if (this.token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: this.getAuthHeaders()
        });
      }
    } catch (error) {
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local
      this.setToken(null);
      localStorage.removeItem('user_info');
      localStorage.removeItem('token_expires');
    }
  }

  // Renouveler le token
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Impossible de renouveler le token');
      }

      const data = await response.json();
      
      // Mettre à jour le token
      this.setToken(data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      localStorage.setItem('token_expires', Date.now() + (data.expires_in * 1000));

      return data;
    } catch (error) {
      // Si le refresh échoue, déconnecter l'utilisateur
      await this.logout();
      throw error;
    }
  }

  // Obtenir les informations de l'utilisateur connecté
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expiré ou invalide');
        }
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      return await response.json();
    } catch (error) {
      if (error.message.includes('Token expiré')) {
        await this.logout();
      }
      throw error;
    }
  }

  // Changer le mot de passe
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erreur lors du changement de mot de passe');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier le statut de l'authentification
  async checkAuthStatus() {
    try {
      const response = await fetch(`${API_BASE}/api/auth/status`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await response.json();
    } catch (error) {
      throw new Error('Erreur lors de la vérification du statut d\'authentification');
    }
  }

  // ===============================
  // MÉTHODES AVEC AUTHENTIFICATION
  // ===============================

  // Méthode générique pour les requêtes authentifiées
  async authenticatedRequest(url, options = {}) {
    // Vérifier si le token est expiré et essayer de le renouveler
    if (this.token && this.isTokenExpired()) {
      try {
        await this.refreshToken();
      } catch (error) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
    }

    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      // Si non autorisé, essayer de renouveler le token une fois
      if (response.status === 401 && this.token) {
        try {
          await this.refreshToken();
          // Refaire la requête avec le nouveau token
          config.headers = {
            ...this.getAuthHeaders(),
            ...options.headers
          };
          const retryResponse = await fetch(url, config);
          
          if (!retryResponse.ok && retryResponse.status === 401) {
            await this.logout();
            throw new Error('Session expirée, veuillez vous reconnecter');
          }
          
          return retryResponse;
        } catch (refreshError) {
          await this.logout();
          throw new Error('Session expirée, veuillez vous reconnecter');
        }
      }

      return response;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erreur de connexion au serveur');
      }
      throw error;
    }
  }

  // ===============================
  // MÉTHODES EXISTANTES MISES À JOUR
  // ===============================

  // Vérifier le statut de l'API
  async checkApiStatus() {
    try {
      const response = await fetch(`${API_BASE}/`);
      return await response.json();
    } catch (error) {
      throw new Error('API non accessible');
    }
  }

  // Récupérer les métriques système (nécessite authentification)
  async getSystemMetrics() {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/health`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des métriques');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Gérer un service (nécessite authentification)
  async manageService(serviceName, action) {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/services/manage`, {
        method: 'POST',
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

  // Récupérer les informations système (nécessite authentification)
  async getSystemInfo() {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/system/info`);
      if (!response.ok) throw new Error('Endpoint non disponible');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les informations hardware (nécessite authentification)
  async getHardwareInfo() {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/hardware/sensors`);
      if (!response.ok) throw new Error('Endpoint non disponible');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les informations réseau (nécessite authentification)
  async getNetworkInfo() {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/network/interfaces`);
      if (!response.ok) throw new Error('Endpoint non disponible');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // ===============================
  // MÉTHODES ADMIN (nécessitent droits admin)
  // ===============================

  // Lister tous les utilisateurs
  async listUsers(skip = 0, limit = 100) {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/api/auth/users?skip=${skip}&limit=${limit}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Créer un utilisateur
  async createUser(userData) {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/api/auth/users`, {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Erreur lors de la création de l\'utilisateur');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Désactiver un utilisateur
  async deactivateUser(userId) {
    try {
      const response = await this.authenticatedRequest(`${API_BASE}/api/auth/users/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Erreur lors de la désactivation de l\'utilisateur');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // ===============================
  // UTILITAIRES
  // ===============================

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return this.token && !this.isTokenExpired();
  }

  // Obtenir les informations utilisateur stockées
  getStoredUserInfo() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const userInfo = this.getStoredUserInfo();
    return userInfo?.is_admin || false;
  }
}

// Créer et exporter l'instance
const apiService = new ApiService();
export default apiService;