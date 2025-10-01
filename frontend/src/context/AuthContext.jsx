// src/context/AuthContext.jsx
// Single responsibility: Provide authenticated user state and actions

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, getAccessToken, clearTokens } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Optionally decode access token to preload user email/role
    const token = getAccessToken();
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        // Note: JWT payload contains email, profil (role), and entrepriseId
        // User ID will be set after login or fetched from backend
        const decodedUser = {
          email: decoded?.email,
          role: decoded?.profil, // Backend uses 'profil' for role in JWT
          entrepriseId: decoded?.entrepriseId
        };
        setUser(decodedUser);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        // Clear invalid tokens
        clearTokens();
      }
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    async login({ email, motDePasse }) {
      const data = await authApi.login({ email, motDePasse });
      const utilisateur = data?.utilisateur;
      const newUser = {
        id: utilisateur?.id,
        email: utilisateur?.email,
        role: utilisateur?.role,
        entrepriseId: utilisateur?.entrepriseId,
        entreprise: utilisateur?.entreprise
      };
      setUser(newUser);
      return utilisateur;
    },
    async register(payload) {
      const data = await authApi.register(payload);
      const utilisateur = data?.utilisateur;
      setUser({
        id: utilisateur?.id,
        email: utilisateur?.email,
        role: utilisateur?.role,
        entrepriseId: utilisateur?.entrepriseId,
        entreprise: utilisateur?.entreprise
      });
      return utilisateur;
    },
    async logout() {
      await authApi.logout();
      setUser(null);
      clearTokens();
    },
    async fetchCurrentUser() {
      try {
        const data = await authApi.getCurrentUser();
        const utilisateur = data?.utilisateur;
        setUser({
          id: utilisateur?.id,
          email: utilisateur?.email,
          role: utilisateur?.role,
          entrepriseId: utilisateur?.entrepriseId,
          entreprise: utilisateur?.entreprise
        });
        return utilisateur;
      } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        return null;
      }
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
