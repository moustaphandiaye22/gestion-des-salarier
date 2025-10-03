// src/utils/api.js
// API client with JWT access/refresh token handling
// - Single responsibility: networking and token persistence helpers
// - No UI concerns

import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3015";

// Token storage keys
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

// Token helpers
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || null;
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || null;
}
export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh token logic
let isRefreshing = false;
let refreshPromise = null; // Promise<string> resolving to new accessToken
const refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}
function onRrefreshed(newToken) {
  while (refreshSubscribers.length) {
    const cb = refreshSubscribers.shift();
    try {
      cb(newToken);
    } catch {}
  }
}

async function performRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");
  const resp = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken }, {
    headers: { "Content-Type": "application/json" },
  });
  const { accessToken } = resp.data || {};
  if (!accessToken) throw new Error("Invalid refresh response");
  setTokens({ accessToken });
  return accessToken;
}

// Attach Authorization header
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add selected company ID for super admin
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');
  if (selectedCompanyId && !config.params?.entrepriseId) {
    config.params = config.params || {};
    config.params.entrepriseId = selectedCompanyId;
  }

  return config;
});

// Handle 401 and refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};

    // If network/canceled or status not 401, propagate
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop for refresh endpoint and auth endpoints that shouldn't retry
    const isRefreshEndpoint = (original.url || "").includes("/api/auth/refresh");
    const isAuthMeEndpoint = (original.url || "").includes("/api/auth/me");
    if (isRefreshEndpoint || isAuthMeEndpoint) {
      clearTokens();
      return Promise.reject(error);
    }

    // Already retried once
    if (original._retry) {
      clearTokens();
      return Promise.reject(error);
    }
    original._retry = true;

    // If a refresh is already in progress, wait for it
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!original.headers) original.headers = {};
          original.headers.Authorization = `Bearer ${newToken}`;
          api.request(original).then(resolve).catch(reject);
        });
      });
    }

    // Start a new refresh flow
    try {
      isRefreshing = true;
      refreshPromise = performRefreshToken();
      const newToken = await refreshPromise;
      onRrefreshed(newToken);
      if (!original.headers) original.headers = {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return api.request(original);
    } catch (e) {
      clearTokens();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }
);

// Auth API
export const authApi = {
  async login({ email, motDePasse }) {
    const res = await api.post("/api/auth/login", { email, motDePasse });
    const { accessToken, refreshToken, utilisateur } = res.data || {};
    setTokens({ accessToken, refreshToken });
    return { utilisateur };
  },
  async register(payload) {
    const res = await api.post("/api/auth/register", payload);
    const { accessToken, refreshToken, utilisateur } = res.data || {};
    setTokens({ accessToken, refreshToken });
    return { utilisateur };
  },
  async getCurrentUser() {
    const res = await api.get("/api/auth/me");
    return res.data;
  },
  async refresh() {
    const token = getRefreshToken();
    const res = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken: token });
    const { accessToken } = res.data || {};
    if (accessToken) setTokens({ accessToken });
    return res.data;
  },
  async logout() {
    const token = getRefreshToken();
    try {
      await api.post("/api/auth/logout", { refreshToken: token });
    } finally {
      clearTokens();
    }
  },
};

// Generic CRUD helpers
function toQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

// Domain APIs mapping your backend routes (normalized to data shapes)
export const employesApi = {
  list: (params) => api.get(`/api/employes${toQuery(params)}`).then((r) => r.data?.employes || r.data || []),
  get: (id) => api.get(`/api/employes/${id}`).then((r) => r.data?.employe || r.data || null),
  getLatestBulletin: (employeeId) => api.get(`/api/employes/${employeeId}/latest-bulletin`).then((r) => r.data?.bulletin || null).catch((err) => {
    // Si 404, retourner null au lieu de throw
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }),
  create: (payload) => api.post(`/api/employes`, payload).then((r) => r.data?.employe || r.data || null),
  bulkImport: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/employes/bulk-import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((r) => r.data);
  },
  update: (id, payload) => api.put(`/api/employes/${id}`, payload).then((r) => r.data?.employe || r.data || null),
  remove: (id) => api.delete(`/api/employes/${id}`).then((r) => r.data),
  exportTemplate: () => api.get(`/api/employes/export/template`, { responseType: 'blob' }).then((r) => r),
};

export const entreprisesApi = {
  list: (params) => api.get(`/api/entreprises${toQuery(params)}`).then((r) => r.data?.entreprises || r.data || []),
  get: (id) => api.get(`/api/entreprises/${id}`).then((r) => r.data?.entreprise || r.data || null),
  create: (payload) => {
    if (payload instanceof FormData) {
      return api.post(`/api/entreprises`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((r) => r.data?.entreprise || r.data || null);
    } else {
      return api.post(`/api/entreprises`, payload).then((r) => r.data?.entreprise || r.data || null);
    }
  },
  update: (id, payload) => {
    if (payload instanceof FormData) {
      return api.put(`/api/entreprises/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((r) => r.data?.entreprise || r.data || null);
    } else {
      return api.put(`/api/entreprises/${id}`, payload).then((r) => r.data?.entreprise || r.data || null);
    }
  },
  remove: (id) => api.delete(`/api/entreprises/${id}`).then((r) => r.data),
};

export const bulletinsApi = {
  list: (params) => api.get(`/api/bulletins${toQuery(params)}`).then((r) => r.data?.bulletins || r.data || []),
  listByEntreprise: (entrepriseId) => api.get(`/api/bulletins?entrepriseId=${entrepriseId}`).then((r) => r.data?.bulletins || r.data || []),
  get: (id) => api.get(`/api/bulletins/${id}`).then((r) => r.data?.bulletin || r.data || null),
  create: (payload) => api.post(`/api/bulletins`, payload).then((r) => r.data?.bulletin || r.data || null),
  update: (id, payload) => api.put(`/api/bulletins/${id}`, payload).then((r) => r.data?.bulletin || r.data || null),
  remove: (id) => api.delete(`/api/bulletins/${id}`).then((r) => r.data),
  downloadPdf: (id) => api.get(`/api/bulletins/${id}/pdf`, { responseType: 'blob' }).then((r) => r.data),
  exportExcel: () => api.get(`/api/bulletins/export/excel`, { responseType: 'blob' }).then((r) => r),
};

export const paiementsApi = {
  list: (params) => api.get(`/api/paiements${toQuery(params)}`).then((r) => r.data?.paiements || r.data || []),
  get: (id) => api.get(`/api/paiements/${id}`).then((r) => r.data?.paiement || r.data || null),
  create: (payload) => api.post(`/api/paiements`, payload).then((r) => r.data?.paiement || r.data || null),
  update: (id, payload) => api.put(`/api/paiements/${id}`, payload).then((r) => r.data?.paiement || r.data || null),
  remove: (id) => api.delete(`/api/paiements/${id}`).then((r) => r.data),
  exportExcel: () => api.get(`/api/paiements/export/excel`, { responseType: 'blob' }).then((r) => r),
};

export const cyclesPaieApi = {
  list: (params) => api.get(`/api/cycles-paie${toQuery(params)}`).then((r) => r.data?.cycles || []),
  get: (id) => api.get(`/api/cycles-paie/${id}`).then((r) => r.data?.cycle || null),
  create: (payload) => api.post(`/api/cycles-paie`, payload).then((r) => r.data?.cycle || null),
  update: (id, payload) => api.put(`/api/cycles-paie/${id}`, payload).then((r) => r.data?.cycle || null),
  remove: (id) => api.delete(`/api/cycles-paie/${id}`).then((r) => r.data),

  validate: (id) => api.put(`/api/cycles-paie/${id}/validate`).then((r) => r.data?.cycle || null),
  close: (id) => api.put(`/api/cycles-paie/${id}/close`).then((r) => r.data?.cycle || null),
  canCashierPay: (id) => api.get(`/api/cycles-paie/${id}/can-cashier-pay`).then((r) => r.data?.canPay || false),
};

export const parametreEntrepriseApi = {
  list: (params) => api.get(`/api/parametres-entreprise${toQuery(params)}`).then((r) => r.data?.parametres || []),
  get: (id) => api.get(`/api/parametres-entreprise/${id}`).then((r) => r.data?.parametre || null),
  create: (payload) => api.post(`/api/parametres-entreprise`, payload).then((r) => r.data?.parametre || null),
  update: (id, payload) => api.put(`/api/parametres-entreprise/${id}`, payload).then((r) => r.data?.parametre || null),
  remove: (id) => api.delete(`/api/parametres-entreprise/${id}`).then((r) => r.data),
};

// These controllers return raw arrays/objects (no wrapper keys)
export const rapportsApi = {
  list: (params) => api.get(`/api/rapports${toQuery(params)}`).then((r) => r.data),
  get: (id) => api.get(`/api/rapports/${id}`).then((r) => r.data),
  getPdf: (id) => api.get(`/api/rapports/${id}/pdf`, { responseType: 'blob' }).then((r) => r.data),
  create: (payload) => api.post(`/api/rapports`, payload).then((r) => r.data),
  update: (id, payload) => api.put(`/api/rapports/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/rapports/${id}`).then((r) => r.data),
};

export const tableauDeBordApi = {
  stats: (params) => api.get(`/api/tableaux-de-bord${toQuery(params)}`).then((r) => r.data),
};

export const journauxAuditApi = {
  list: (params) => api.get(`/api/journaux-audit${toQuery(params)}`).then((r) => r.data),
  get: (id) => api.get(`/api/journaux-audit/${id}`).then((r) => r.data),
  create: (payload) => api.post(`/api/journaux-audit`, payload).then((r) => r.data),
  update: (id, payload) => api.put(`/api/journaux-audit/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/journaux-audit/${id}`).then((r) => r.data),
};

export const utilisateursApi = {
  list: (params) => api.get(`/api/utilisateurs${toQuery(params)}`).then((r) => r.data?.utilisateurs || r.data || []),
  get: (id) => api.get(`/api/utilisateurs/${id}`).then((r) => r.data?.utilisateur || r.data || null),
  create: (payload) => api.post(`/api/utilisateurs`, payload).then((r) => r.data?.utilisateur || r.data || null),
  update: (id, payload) => api.put(`/api/utilisateurs/${id}`, payload).then((r) => r.data?.utilisateur || r.data || null),
  remove: (id) => api.delete(`/api/utilisateurs/${id}`).then((r) => r.data),
};

export const parametresGlobauxApi = {
  list: (params) => api.get(`/api/parametres-globaux${toQuery(params)}`).then((r) => r.data?.parametres || []),
  get: (id) => api.get(`/api/parametres-globaux/${id}`).then((r) => r.data?.parametre || null),
  getByKey: (cle) => api.get(`/api/parametres-globaux/cle/${cle}`).then((r) => r.data?.parametre || null),
  getValue: (cle) => api.get(`/api/parametres-globaux/valeur/${cle}`).then((r) => r.data?.valeur || null),
  getByCategory: (categorie) => api.get(`/api/parametres-globaux/categorie/${categorie}`).then((r) => r.data?.parametres || []),
  create: (payload) => api.post(`/api/parametres-globaux`, payload).then((r) => r.data?.parametre || null),
  update: (id, payload) => api.put(`/api/parametres-globaux/${id}`, payload).then((r) => r.data?.parametre || null),
  remove: (id) => api.delete(`/api/parametres-globaux/${id}`).then((r) => r.data),
};

export const professionsApi = {
  list: (params) => api.get(`/api/professions${toQuery(params)}`).then((r) => r.data?.professions || r.data || []),
  get: (id) => api.get(`/api/professions/${id}`).then((r) => r.data?.profession || r.data || null),
  create: (payload) => api.post(`/api/professions`, payload).then((r) => r.data?.profession || r.data || null),
  update: (id, payload) => api.put(`/api/professions/${id}`, payload).then((r) => r.data?.profession || r.data || null),
  remove: (id) => api.delete(`/api/professions/${id}`).then((r) => r.data),
};

export const licencesApi = {
  list: (params) => api.get(`/api/licences${toQuery(params)}`).then((r) => r.data?.licences || r.data || []),
  get: (id) => api.get(`/api/licences/${id}`).then((r) => r.data?.licence || r.data || null),
  getByNom: (nom) => api.get(`/api/licences/nom/${nom}`).then((r) => r.data?.licence || r.data || null),
  getByEntreprise: (entrepriseId) => api.get(`/api/licences/entreprise/${entrepriseId}`).then((r) => r.data?.licences || r.data || []),
  getByStatut: (statut) => api.get(`/api/licences/statut/${statut}`).then((r) => r.data?.licences || r.data || []),
  getByType: (typeLicence) => api.get(`/api/licences/type/${typeLicence}`).then((r) => r.data?.licences || r.data || []),
  create: (payload) => api.post(`/api/licences`, payload).then((r) => r.data?.licence || r.data || null),
  update: (id, payload) => api.put(`/api/licences/${id}`, payload).then((r) => r.data?.licence || r.data || null),
  remove: (id) => api.delete(`/api/licences/${id}`).then((r) => r.data),
  assignToEntreprise: (id, entrepriseId) => api.post(`/api/licences/${id}/assign`, { entrepriseId }).then((r) => r.data?.licence || r.data || null),
  revokeFromEntreprise: (id) => api.post(`/api/licences/${id}/revoke`).then((r) => r.data?.licence || r.data || null),
};

export const pointagesApi = {
   list: (params) => api.get(`/api/pointages${toQuery(params)}`).then((r) => r.data?.pointages || r.data || []),
   get: (id) => api.get(`/api/pointages/${id}`).then((r) => r.data?.pointage || r.data || null),
   create: (payload) => api.post(`/api/pointages`, payload).then((r) => r.data?.pointage || r.data || null),
   update: (id, payload) => api.put(`/api/pointages/${id}`, payload).then((r) => r.data?.pointage || r.data || null),
   remove: (id) => api.delete(`/api/pointages/${id}`).then((r) => r.data),

   // Pointages par employé
   getByEmploye: (employeId) => api.get(`/api/pointages/employe/${employeId}`).then((r) => r.data?.pointages || r.data || []),
   getByEmployeAndPeriode: (employeId, dateDebut, dateFin) =>
     api.get(`/api/pointages/employe/${employeId}/periode?dateDebut=${dateDebut}&dateFin=${dateFin}`)
       .then((r) => r.data?.pointages || r.data || []),

   // Pointages par entreprise et période
   getByEntrepriseAndDate: (entrepriseId, dateDebut, dateFin) =>
     api.get(`/api/pointages/entreprise/${entrepriseId}/periode?dateDebut=${dateDebut}&dateFin=${dateFin}`)
       .then((r) => r.data?.pointages || r.data || []),

   // Pointages par type et statut
   getByType: (type) => api.get(`/api/pointages/type/${type}`).then((r) => r.data?.pointages || r.data || []),
   getByStatut: (statut) => api.get(`/api/pointages/statut/${statut}`).then((r) => r.data?.pointages || r.data || []),

   // Actions de pointage rapide
   pointerEntree: (payload) => api.post(`/api/pointages/entree`, payload).then((r) => r.data?.pointage || r.data || null),
   pointerSortie: (payload) => api.post(`/api/pointages/sortie`, payload).then((r) => r.data?.pointage || r.data || null),

   // Calculs et statistiques
   calculateHeuresTravaillees: (employeId, dateDebut, dateFin) =>
     api.get(`/api/pointages/employe/${employeId}/heures?dateDebut=${dateDebut}&dateFin=${dateFin}`)
       .then((r) => r.data?.heuresTravaillees || 0),

   getStatistiques: (entrepriseId, dateDebut, dateFin) =>
     api.get(`/api/pointages/entreprise/${entrepriseId}/statistiques?dateDebut=${dateDebut}&dateFin=${dateFin}`)
       .then((r) => r.data?.statistiques || {}),

   // Import/Export
   bulkCreate: (pointages) => api.post(`/api/pointages/bulk`, { pointages }).then((r) => r.data),

   // Filtres avancés
   filter: (params) => api.get(`/api/pointages/filter${toQuery(params)}`).then((r) => r.data?.pointages || r.data || []),
};

export const qrcodesApi = {
   // Génération de QR codes
   generateQrCode: (employeId) => api.post(`/api/qrcodes/employe/${employeId}/generate`).then((r) => r.data),
   regenerateQrCode: (employeId) => api.post(`/api/qrcodes/employe/${employeId}/regenerate`).then((r) => r.data),
   generateMultipleQrCodes: (entrepriseId) => api.post(`/api/qrcodes/entreprise/${entrepriseId}/generate-all`).then((r) => r.data),

   // Informations sur les QR codes
   getQrCodeInfo: (employeId) => api.get(`/api/qrcodes/employe/${employeId}/info`).then((r) => r.data),

   // Actions avec QR codes (sans authentification)
       scanQrCode: (qrContent) => axios.post(`${API_BASE_URL}/api/qrcodes/scan`, { qrContent }).then((r) => r.data),
       pointerParQrCode: (payload) => axios.post(`${API_BASE_URL}/api/qrcodes/pointer`, payload).then((r) => r.data),

   // Gestion des images QR code
   getQrCodeImage: (employeId) => api.get(`/api/employes/${employeId}/qr-image`, { responseType: 'blob' }).then((r) => r.data),
};

export default api;
