import { PrismaClient, Prisma } from '@prisma/client';

import type { Entreprise } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
import { mnprisma } from '../config/db.js';

export class  entrepriseRepository implements InterfaceRepository<Entreprise> {
  async setEstActive(id: number, estActive: boolean): Promise<Entreprise> {
    return mnprisma.entreprise.update({ where: { id }, data: { estActive } });
  }

  async create(data: Omit<Entreprise, "id">) :Promise <Entreprise> {
    return mnprisma.entreprise.create({ data});
  }

  async findById(id: number) {
      return mnprisma.entreprise.findUnique({ where: { id }, include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true } });
  }

  async findAll() {
      return mnprisma.entreprise.findMany({ include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true } });
  }

  async findAllByUser(user: any) {
    // Super Admin voit toutes les entreprises
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.entreprise.findMany({
        include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true }
      });
    }

    // Admin d'Entreprise et Caissier voient seulement leur propre entreprise
    if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
      return mnprisma.entreprise.findMany({
        where: { id: user.entrepriseId },
        include: { employes: true, cyclesPaie: true, paiements: true, utilisateurs: true }
      });
    }

    // Autres rôles n'ont pas accès à la liste des entreprises
    return [];
  }

  async update(id: number, data: Partial<Entreprise>) {
    return mnprisma.entreprise.update({ where: { id }, data });
  }

  async delete(id: number) :Promise<void> {
    await mnprisma.entreprise.delete({ where: { id } });
  }

};
