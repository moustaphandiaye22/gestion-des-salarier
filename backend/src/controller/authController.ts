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
}

// Factory function pour créer le controller avec les dépendances
export const createAuthController = (authService: IAuthService) => {
  return new AuthController(authService);
};
