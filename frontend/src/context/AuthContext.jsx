// src/context/AuthContext.jsx
// Single responsibility: Provide authenticated user state and actions

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, getAccessToken, clearTokens } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionally decode access token to preload user email/role
    const token = getAccessToken();
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        setUser({ email: decoded?.email, role: decoded?.profil });
      } catch {}
    }
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    async login({ email, motDePasse }) {
      const data = await authApi.login({ email, motDePasse });
      const utilisateur = data?.utilisateur;
      setUser({ email: utilisateur?.email, role: utilisateur?.role });
      return utilisateur;
    },
    async register(payload) {
      const data = await authApi.register(payload);
      const utilisateur = data?.utilisateur;
      setUser({ email: utilisateur?.email, role: utilisateur?.role });
      return utilisateur;
    },
    async logout() {
      await authApi.logout();
      setUser(null);
      clearTokens();
    },
  }), [user]);

  if (loading) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
