import type { Utilisateur } from '@prisma/client';

export interface RegisterData {
  email: string;
  motDePasse: string;
  nom?: string;
  prenom?: string;
  role?: string;
}

export interface LoginData {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  utilisateur: Utilisateur;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface IAuthService {
  register(data: RegisterData): Promise<AuthResponse>;
  login(data: LoginData): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<RefreshResponse>;
  logout(refreshToken: string): Promise<LogoutResponse>;
  updateProfile(userId: string, profileData: any): Promise<{ utilisateur: Utilisateur }>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
