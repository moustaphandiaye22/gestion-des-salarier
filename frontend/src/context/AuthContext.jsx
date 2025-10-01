// src/context/AuthContext.jsx
// Single responsibility: Provide authenticated user state and actions

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, getAccessToken, clearTokens } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(() => {
    return localStorage.getItem('selectedCompanyId') || null;
  });

  const fetchCurrentUser = async () => {
    // Prevent multiple simultaneous calls
    if (isAuthenticating) {
      throw new Error('Authentication already in progress');
    }

    try {
      setIsAuthenticating(true);
      const data = await authApi.getCurrentUser();
      const utilisateur = data?.utilisateur;
      if (!utilisateur) {
        throw new Error('Aucun utilisateur trouvé');
      }
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
      // Reset user state on authentication failure
      setUser(null);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    // Prevent multiple simultaneous authentication checks
    if (isAuthenticating) return;

    // Check if there's a valid token and fetch current user
    const token = getAccessToken();
    if (token && !user) {
      setIsAuthenticating(true);
      // Try to fetch current user from backend
      fetchCurrentUser()
        .then(() => {
          // User successfully fetched, loading is done
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération du profil utilisateur:', error);
          // If fetching fails, clear tokens and reset user state
          clearTokens();
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
          setIsAuthenticating(false);
        });
    } else if (!token) {
      setIsLoading(false);
      setUser(null);
    }
  }, [isAuthenticating, user]);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticating,
    selectedCompanyId,
    setSelectedCompanyId: (id) => {
      setSelectedCompanyId(id);
      if (id) {
        localStorage.setItem('selectedCompanyId', id);
      } else {
        localStorage.removeItem('selectedCompanyId');
      }
    },
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
    fetchCurrentUser,
  }), [user, isLoading, isAuthenticating]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
