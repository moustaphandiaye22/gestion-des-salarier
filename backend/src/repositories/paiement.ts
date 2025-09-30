import { PrismaClient, Prisma } from '@prisma/client';
import type { Paiement, StatutPaiement } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
import { mnprisma } from '../config/db.js';


export class paiementRepository implements InterfaceRepository  <Paiement>{
  async findByBulletin(bulletinId: number): Promise<Paiement[]> {
    return mnprisma.paiement.findMany({ where: { bulletinId }, include: { bulletin: true, entreprise: true } });
  }

  async setStatut(id: number, statut: StatutPaiement): Promise<Paiement> {
    return mnprisma.paiement.update({ where: { id }, data: { statut } });
  }


  async create(data: Omit<Paiement, "id">) : Promise <Paiement> {
    return mnprisma.paiement.create({ data });
  }

  async findById(id: number) : Promise <Paiement | null> {
  return mnprisma.paiement.findUnique({ where: { id }, include: { bulletin: true, entreprise: true } });
  }

  async findAll() : Promise <Paiement[]> {
  return mnprisma.paiement.findMany({ include: { bulletin: true, entreprise: true } });
  }

  async findAllByUser(user: any) : Promise <Paiement[]> {
    // Super Admin voit tous les paiements
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.paiement.findMany({
        include: { bulletin: true, entreprise: true }
      });
    }

    // Admin d'Entreprise voit seulement les paiements de son entreprise
    if (user.profil === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
      return mnprisma.paiement.findMany({
        where: { entrepriseId: user.entrepriseId },
        include: { bulletin: true, entreprise: true }
      });
    }

    // Autres rôles n'ont pas accès aux paiements
    return [];
  }


  async update(id: number, data: Partial<Omit<Paiement, "id">>) : Promise <Paiement> {
    return mnprisma.paiement.update({ where: { id }, data });
  }

  async delete(id: number) : Promise <void> {
    await mnprisma.paiement.delete({ where: { id } });
  }
  
};

