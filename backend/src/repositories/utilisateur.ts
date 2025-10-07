import type { Utilisateur } from '@prisma/client';
import type { Prisma, RoleUtilisateur } from '@prisma/client';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
import { mnprisma } from '../config/db.js';
import { Logger } from '../utils/logger.js';
import { NotFoundError, ConflictError, InternalServerError } from '../errors/CustomError.js';

export class utilisateurRepository implements IUserRepository {
  async create(data: any): Promise<Utilisateur> {
    try {
      Logger.info('Création d\'un nouvel utilisateur', { email: data.email });
      const utilisateur = await mnprisma.utilisateur.create({ data });
      Logger.info('Utilisateur créé avec succès', { id: utilisateur.id });
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la création de l\'utilisateur', error);
      if (error.code === 'P2002') {
        throw new ConflictError('Un utilisateur avec cet email existe déjà');
      }
      throw new InternalServerError('Impossible de créer l\'utilisateur');
    }
  }

  async findById(id: number): Promise<Utilisateur | null> {
    try {
      Logger.info('Recherche d\'un utilisateur par ID', { id });
      const utilisateur = await mnprisma.utilisateur.findUnique({ where: { id } });
      if (!utilisateur) {
        Logger.warn('Utilisateur non trouvé', { id });
      }
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la recherche de l\'utilisateur par ID', error, { id });
      throw new InternalServerError('Impossible de récupérer l\'utilisateur');
    }
  }

  async findAll(): Promise<Utilisateur[]> {
    try {
      Logger.info('Récupération de tous les utilisateurs');
      const utilisateurs = await mnprisma.utilisateur.findMany();
      Logger.info('Utilisateurs récupérés avec succès', { count: utilisateurs.length });
      return utilisateurs;
    } catch (error: any) {
      Logger.error('Erreur lors de la récupération des utilisateurs', error);
      throw new InternalServerError('Impossible de récupérer la liste des utilisateurs');
    }
  }

  async update(id: number, data: any): Promise<Utilisateur | null> {
    try {
      Logger.info('Mise à jour d\'un utilisateur', { id });
      const utilisateur = await mnprisma.utilisateur.update({ where: { id }, data });
      Logger.info('Utilisateur mis à jour avec succès', { id });
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la mise à jour de l\'utilisateur', error, { id });
      if (error.code === 'P2025') {
        throw new NotFoundError('Utilisateur');
      }
      throw new InternalServerError('Impossible de mettre à jour l\'utilisateur');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      Logger.info('Suppression d\'un utilisateur', { id });
      await mnprisma.utilisateur.delete({ where: { id } });
      Logger.info('Utilisateur supprimé avec succès', { id });
    } catch (error: any) {
      Logger.error('Erreur lors de la suppression de l\'utilisateur', error, { id });
      if (error.code === 'P2025') {
        throw new NotFoundError('Utilisateur');
      }
      throw new InternalServerError('Impossible de supprimer l\'utilisateur');
    }
  }

  async findByRole(role: RoleUtilisateur): Promise<Utilisateur[]> {
    try {
      Logger.info('Recherche d\'utilisateurs par rôle', { role });
      const utilisateurs = await mnprisma.utilisateur.findMany({ where: { role } });
      Logger.info('Utilisateurs trouvés par rôle', { role, count: utilisateurs.length });
      return utilisateurs;
    } catch (error: any) {
      Logger.error('Erreur lors de la recherche par rôle', error, { role });
      throw new InternalServerError('Impossible de récupérer les utilisateurs par rôle');
    }
  }

  async setActif(id: number, estActif: boolean): Promise<Utilisateur> {
    try {
      Logger.info('Modification du statut actif d\'un utilisateur', { id, estActif });
      const utilisateur = await mnprisma.utilisateur.update({ where: { id }, data: { estActif } });
      Logger.info('Statut actif modifié avec succès', { id, estActif });
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la modification du statut actif', error, { id, estActif });
      if (error.code === 'P2025') {
        throw new NotFoundError('Utilisateur');
      }
      throw new InternalServerError('Impossible de modifier le statut de l\'utilisateur');
    }
  }

  async findByEmail(email: string): Promise<Utilisateur | null> {
    try {
      Logger.info('Recherche d\'un utilisateur par email', { email });
      const utilisateur = await mnprisma.utilisateur.findUnique({
        where: { email },
        include: {
          entreprise: {
            select: {
              id: true,
              nom: true,
              logo: true,
              couleurPrimaire: true,
              couleurSecondaire: true
            }
          }
        }
      });
      if (!utilisateur) {
        Logger.warn('Utilisateur non trouvé par email', { email });
      }
      return utilisateur;
    } catch (error: any) {
      Logger.error('Erreur lors de la recherche par email', error, { email });
      throw new InternalServerError('Impossible de rechercher l\'utilisateur par email');
    }
  }

  async findByEntreprise(entrepriseId: number): Promise<Utilisateur[]> {
    try {
      Logger.info('Recherche d\'utilisateurs par entreprise', { entrepriseId });
      const utilisateurs = await mnprisma.utilisateur.findMany({
        where: { entrepriseId }
      });
      Logger.info('Utilisateurs trouvés par entreprise', { entrepriseId, count: utilisateurs.length });
      return utilisateurs;
    } catch (error: any) {
      Logger.error('Erreur lors de la recherche par entreprise', error, { entrepriseId });
      throw new InternalServerError('Impossible de récupérer les utilisateurs par entreprise');
    }
  }
}
