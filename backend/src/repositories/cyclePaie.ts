import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
import type { CyclePaie, StatutCyclePaie } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';



export class cyclePaieRepository implements InterfaceRepository<CyclePaie> {

  async findByEntreprise(entrepriseId: number): Promise< CyclePaie []> {
    return mnprisma.cyclePaie.findMany({ where: { entrepriseId }, include: { entreprise: true, bulletins: true } });
  }

  async setStatut(id: number, statut: StatutCyclePaie): Promise<CyclePaie> {
    return mnprisma.cyclePaie.update({ where: { id }, data: { statut } });
  }

  async create(data: Omit<CyclePaie, "id">) : Promise<CyclePaie>{
    return mnprisma.cyclePaie.create({ data });
  }

  async findById(id: number) : Promise<CyclePaie | null> {
  return mnprisma.cyclePaie.findUnique({ where: { id }, include: { entreprise: true, bulletins: true } });
  }

  async findAll() : Promise<CyclePaie[]> {
  return mnprisma.cyclePaie.findMany({ include: { entreprise: true, bulletins: true } });
  }

  async findAllByUser(user: any) : Promise<CyclePaie[]> {
    // Super Admin voit tous les cycles de paie
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.cyclePaie.findMany({
        include: { entreprise: true, bulletins: true }
      });
    }

    // Admin d'Entreprise voit seulement les cycles de son entreprise
    if (user.profil === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
      return mnprisma.cyclePaie.findMany({
        where: { entrepriseId: user.entrepriseId },
        include: { entreprise: true, bulletins: true }
      });
    }

    // Autres rôles n'ont pas accès aux cycles de paie
    return [];
  }

  async update(id: number, data: Partial <Omit<CyclePaie,"id">>) : Promise<CyclePaie> {
    return mnprisma.cyclePaie.update({ where: { id }, data });
  }

  async delete(id: number) : Promise<void> {
    await mnprisma.cyclePaie.delete({ where: { id } });
  }

};
