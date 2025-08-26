// Client API pour communiquer avec le backend Node.js

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.token || this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
    return { success: true, message: 'Déconnexion réussie' };
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  // Diligences
  async getDiligences() {
    return this.request('/diligences');
  }

  async createDiligence(diligenceData) {
    return this.request('/diligences', {
      method: 'POST',
      body: JSON.stringify(diligenceData),
    });
  }

  async updateDiligence(id, diligenceData) {
    return this.request(`/diligences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(diligenceData),
    });
  }

  async deleteDiligence(id) {
    return this.request(`/diligences/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.getToken();
  }

  // Récupérer les informations de l'utilisateur connecté
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Configuration SMTP
  async getSmtpConfig() {
    return this.request('/smtp/config');
  }

  async saveSmtpConfig(configData) {
    return this.request('/smtp/config', {
      method: 'POST',
      body: JSON.stringify(configData),
    });
  }

  async testSmtpConnection(configData) {
    return this.request('/smtp/test', {
      method: 'POST',
      body: JSON.stringify(configData),
    });
  }
}

// Instance singleton
export const apiClient = new ApiClient();

// Hook pour utiliser le client API (à utiliser dans les composants React)
export const useApi = () => {
  return apiClient;
};

export default apiClient;