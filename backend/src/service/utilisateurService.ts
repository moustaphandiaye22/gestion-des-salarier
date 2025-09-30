import type { Utilisateur } from '@prisma/client';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
import { utilisateurValidator } from '../validators/utilisateur.js';
import { AuthUtils } from '../auth/authUtils.js';
import { Logger } from '../utils/logger.js';
import { ValidationError, NotFoundError, InternalServerError } from '../errors/CustomError.js';

export interface CreateUtilisateurData {
  email: string;
  motDePasse: string;
  nom?: string;
  prenom?: string;
  role?: string;
  entrepriseId?: number;
}

export interface UpdateUtilisateurData {
  email?: string;
  motDePasse?: string;
  nom?: string;
  prenom?: string;
  role?: string;
  estActif?: boolean;
  entrepriseId?: number;
}

export interface IUtilisateurService {
  createUtilisateur(data: CreateUtilisateurData): Promise<Utilisateur>;
  getUtilisateur(id: number): Promise<Utilisateur | null>;
  getAllUtilisateurs(): Promise<Utilisateur[]>;
  getUtilisateursByEntreprise(entrepriseId: number): Promise<Utilisateur[]>;
  updateUtilisateur(id: number, data: UpdateUtilisateurData): Promise<Utilisateur | null>;
  deleteUtilisateur(id: number): Promise<void>;
}

export class UtilisateurService implements IUtilisateurService {
  constructor(private userRepository: IUserRepository) {}

  async createUtilisateur(data: CreateUtilisateurData): Promise<Utilisateur> {
    try {
      Logger.info('Création d\'un nouvel utilisateur', { email: data.email });

      // Validation des données
      const parsed = utilisateurValidator.safeParse(data);
      if (!parsed.success) {
        Logger.warn('Échec de validation lors de la création de l\'utilisateur', { errors: parsed.error.issues });
        throw new ValidationError('Données d\'utilisateur invalides', parsed.error.issues);
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        Logger.warn('Tentative de création avec un email déjà utilisé', { email: data.email });
        throw new ValidationError('Un utilisateur avec cet email existe déjà');
      }

      // Hash du mot de passe
      const hashedPassword = await AuthUtils.hashPassword(data.motDePasse);

      // Créer l'utilisateur
      const userData = {
        ...data,
        motDePasse: hashedPassword,
        role: data.role || 'EMPLOYE',
        estActif: true
      };

      const utilisateur = await this.userRepository.create(userData);
      Logger.info('Utilisateur créé avec succès', { userId: utilisateur.id });
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la création de l\'utilisateur', error, { email: data.email });
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Impossible de créer l\'utilisateur');
    }
  }

  async getUtilisateur(id: number): Promise<Utilisateur | null> {
    try {
      Logger.info('Récupération d\'un utilisateur par ID', { id });

      if (!id || id <= 0) {
        throw new ValidationError('ID d\'utilisateur invalide');
      }

      const utilisateur = await this.userRepository.findById(id);
      if (!utilisateur) {
        Logger.warn('Utilisateur non trouvé', { id });
        throw new NotFoundError('Utilisateur');
      }

      Logger.info('Utilisateur récupéré avec succès', { id });
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la récupération de l\'utilisateur', error, { id });
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Impossible de récupérer l\'utilisateur');
    }
  }

  async getAllUtilisateurs(): Promise<Utilisateur[]> {
    try {
      Logger.info('Récupération de tous les utilisateurs');
      const utilisateurs = await this.userRepository.findAll();
      Logger.info('Utilisateurs récupérés avec succès', { count: utilisateurs.length });
      return utilisateurs;
    } catch (error: any) {
      Logger.error('Erreur lors de la récupération des utilisateurs', error);
      throw new InternalServerError('Impossible de récupérer la liste des utilisateurs');
    }
  }

  async getUtilisateursByEntreprise(entrepriseId: number): Promise<Utilisateur[]> {
    try {
      Logger.info('Récupération des utilisateurs par entreprise', { entrepriseId });
      const utilisateurs = await this.userRepository.findByEntreprise(entrepriseId);
      Logger.info('Utilisateurs récupérés avec succès', { count: utilisateurs.length, entrepriseId });
      return utilisateurs;
    } catch (error: any) {
      Logger.error('Erreur lors de la récupération des utilisateurs par entreprise', error, { entrepriseId });
      throw new InternalServerError('Impossible de récupérer la liste des utilisateurs');
    }
  }

  async updateUtilisateur(id: number, data: UpdateUtilisateurData): Promise<Utilisateur | null> {
    try {
      Logger.info('Mise à jour d\'un utilisateur', { id });

      if (!id || id <= 0) {
        throw new ValidationError('ID d\'utilisateur invalide');
      }

      // Validation des données partielles
      const parsed = utilisateurValidator.partial().safeParse(data);
      if (!parsed.success) {
        Logger.warn('Échec de validation lors de la mise à jour', { errors: parsed.error.issues });
        throw new ValidationError('Données de mise à jour invalides', parsed.error.issues);
      }

      // Hash du mot de passe si fourni
      let updateData = { ...data };
      if (data.motDePasse) {
        updateData.motDePasse = await AuthUtils.hashPassword(data.motDePasse);
      }

      const utilisateur = await this.userRepository.update(id, updateData);
      if (!utilisateur) {
        Logger.warn('Utilisateur non trouvé pour mise à jour', { id });
        throw new NotFoundError('Utilisateur');
      }

      Logger.info('Utilisateur mis à jour avec succès', { id });
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la mise à jour de l\'utilisateur', error, { id });
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Impossible de mettre à jour l\'utilisateur');
    }
  }

  async deleteUtilisateur(id: number): Promise<void> {
    try {
      Logger.info('Suppression d\'un utilisateur', { id });

      if (!id || id <= 0) {
        throw new ValidationError('ID d\'utilisateur invalide');
      }

      // Vérifier que l'utilisateur existe avant suppression
      const utilisateur = await this.userRepository.findById(id);
      if (!utilisateur) {
        Logger.warn('Utilisateur non trouvé pour suppression', { id });
        throw new NotFoundError('Utilisateur');
      }

      await this.userRepository.delete(id);
      Logger.info('Utilisateur supprimé avec succès', { id });
    } catch (error: any) {
      Logger.error('Erreur lors de la suppression de l\'utilisateur', error, { id });
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Impossible de supprimer l\'utilisateur');
    }
  }
}

// Factory function pour créer le service avec les dépendances
export const createUtilisateurService = (userRepository: IUserRepository): IUtilisateurService => {
  return new UtilisateurService(userRepository);
};
