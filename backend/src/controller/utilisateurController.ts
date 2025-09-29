import type { Request, Response, NextFunction } from 'express';
import type { IUtilisateurService } from '../service/utilisateurService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { Logger } from '../utils/logger.js';

export class UtilisateurController {
    
  constructor(private utilisateurService: IUtilisateurService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('Requête de création d\'utilisateur reçue', { email: req.body.email });
    const utilisateur = await this.utilisateurService.createUtilisateur(req.body);
    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      utilisateur
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('Requête de récupération de tous les utilisateurs reçue');
    const utilisateurs = await this.utilisateurService.getAllUtilisateurs();
    res.json({
      message: 'Liste des utilisateurs récupérée avec succès.',
      utilisateurs
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    Logger.info('Requête de récupération d\'utilisateur par ID reçue', { id });
    const utilisateur = await this.utilisateurService.getUtilisateur(id);
    res.json({
      message: 'Utilisateur récupéré avec succès.',
      utilisateur
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    Logger.info('Requête de mise à jour d\'utilisateur reçue', { id });
    const utilisateur = await this.utilisateurService.updateUtilisateur(id, req.body);
    res.json({
      message: 'Utilisateur mis à jour avec succès.',
      utilisateur
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    Logger.info('Requête de suppression d\'utilisateur reçue', { id });
    await this.utilisateurService.deleteUtilisateur(id);
    res.json({
      message: `Utilisateur avec l'identifiant ${id} supprimé avec succès.`
    });
  });
}

// Factory function pour créer le controller avec les dépendances
export const createUtilisateurController = (utilisateurService: IUtilisateurService) => {
  return new UtilisateurController(utilisateurService);
};
