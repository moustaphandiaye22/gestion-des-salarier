import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3015';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestionnaire d'erreur global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API instance séparée pour les exports (sans redirection automatique sur 401)
const exportApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000
});

// Intercepteur pour ajouter le token d'authentification aux exports
exportApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestionnaire d'erreur pour les exports (pas de redirection automatique)
exportApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Pour les exports, on ne redirige pas automatiquement vers login
    // L'utilisateur peut rester sur la page et voir un message d'erreur
    return Promise.reject(error);
  }
);

export const dashboardApi = {
  // Récupération des KPIs
  getKPIs: async (entrepriseId, tableauDeBordId) => {
    const response = await api.get(`/dashboard/kpis/${entrepriseId}/${tableauDeBordId}`);
    return response.data;
  },

  // Récupération des données d'évolution
  getEvolutionData: async (entrepriseId, typeKpi, months = 6) => {
    const response = await api.get(`/dashboard/evolution/${entrepriseId}/${typeKpi}?months=${months}`);
    return response.data;
  },

  // Comparaison de périodes
  comparePeriods: async (entrepriseId, typeKpi, period1Start, period1End, period2Start, period2End) => {
    const response = await api.post('/dashboard/compare-periods', {
      entrepriseId,
      typeKpi,
      period1Start,
      period1End,
      period2Start,
      period2End
    });
    return response.data;
  },

  // Gestion des alertes
  getAlertes: async (entrepriseId, tableauDeBordId) => {
    const response = await api.get(`/dashboard/alerts/${entrepriseId}/${tableauDeBordId}`);
    return response.data;
  },

  markAlerteAsRead: async (alerteId) => {
    const response = await api.put(`/dashboard/alerts/${alerteId}/read`);
    return response.data;
  },

  generateAlertes: async (entrepriseId, tableauDeBordId) => {
    const response = await api.post(`/dashboard/alerts/generate/${entrepriseId}/${tableauDeBordId}`);
    return response.data;
  },

  getAlertesStats: async (entrepriseId) => {
    const response = await api.get(`/dashboard/alerts/statistics/${entrepriseId}`);
    return response.data;
  },

  // Gestion des exports
  createExport: async (type, format, parametres) => {
    const response = await exportApi.post('/dashboard/export', {
      type,
      format,
      parametres
    });
    return response.data;
  },

  getExports: async () => {
    const response = await exportApi.get('/dashboard/exports');
    return response.data;
  },

  downloadExport: async (exportId) => {
    const response = await exportApi.get(`/dashboard/exports/${exportId}/download`, {
      responseType: 'blob'
    });
    return response;
  },

  // Récupération du résumé du dashboard
  getDashboardSummary: async (entrepriseId, tableauDeBordId) => {
    const response = await api.get(`/dashboard/summary/${entrepriseId}?tableauDeBordId=${tableauDeBordId}`);
    return response.data;
  },

  // Statistiques WebSocket (admin)
  getWebSocketStats: async () => {
    const response = await api.get('/dashboard/websocket/stats');
    return response.data;
  }
};

export default dashboardApi;
