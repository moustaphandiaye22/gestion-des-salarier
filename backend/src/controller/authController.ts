import type { Request, Response, NextFunction } from 'express';
import type { IAuthService } from '../interfaces/IAuthService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { Logger } from '../utils/logger.js';

export class AuthController {
  constructor(private authService: IAuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('Requête d\'inscription reçue', { email: req.body.email });
    const result = await this.authService.register(req.body);
    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      utilisateur: result.utilisateur,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, motDePasse } = req.body;
    Logger.info('Requête de connexion reçue', { email });
    const result = await this.authService.login({ email, motDePasse });
    res.json({
      message: 'Connexion réussie.',
      utilisateur: result.utilisateur,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    Logger.info('Requête de rafraîchissement de token reçue');
    const result = await this.authService.refreshToken(refreshToken);
    res.json({
      message: 'Token rafraîchi avec succès.',
      accessToken: result.accessToken
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    Logger.info('Requête de déconnexion reçue');
    const result = await this.authService.logout(refreshToken || '');
    res.json(result);
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('Requête de récupération de l\'utilisateur actuel reçue');
    // L'utilisateur est déjà attaché par le middleware d'authentification
    const utilisateur = (req as any).user;
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    res.json({
      message: 'Utilisateur récupéré avec succès.',
      utilisateur
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('Requête de mise à jour du profil reçue');
    const utilisateur = (req as any).user;
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const result = await this.authService.updateProfile(utilisateur.id, req.body);
    res.json({
      message: 'Profil mis à jour avec succès.',
      utilisateur: result.utilisateur
    });
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('Requête de changement de mot de passe reçue');
    const utilisateur = (req as any).user;
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const { currentPassword, newPassword } = req.body;
    await this.authService.changePassword(utilisateur.id, currentPassword, newPassword);
    res.json({
      message: 'Mot de passe changé avec succès.'
    });
  });
}

// Factory function pour créer le controller avec les dépendances
export const createAuthController = (authService: IAuthService) => {
  return new AuthController(authService);
};
