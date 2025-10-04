import { PrismaClient, Prisma } from '@prisma/client';
import { mnprisma } from '../config/db.js';
import type { CyclePaie, StatutCyclePaie, StatutValidationCycle } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';



export class cyclePaieRepository implements InterfaceRepository<CyclePaie> {

  async findByEntreprise(entrepriseId: number): Promise< CyclePaie []> {
    return mnprisma.cyclePaie.findMany({ where: { entrepriseId }, include: { entreprise: true, bulletins: true } });
  }

  async setStatut(id: number, statut: StatutCyclePaie): Promise<CyclePaie> {
    return mnprisma.cyclePaie.update({ where: { id }, data: { statut } });
  }

  async create(data: Omit<CyclePaie, "id">) : Promise<CyclePaie>{
    try {
      return await mnprisma.cyclePaie.create({ data });
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === 'P2002' && error.meta?.target?.includes('pay_cycles_entrepriseId_nom_key')) {
        const errorMessage = `Un cycle de paie avec le nom "${data.nom}" existe déjà pour cette entreprise.`;
        throw new Error(errorMessage);
      }
      throw error;
    }
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

    // Admin d'Entreprise et Caissier voient seulement les cycles de leur entreprise
    if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
      return mnprisma.cyclePaie.findMany({
        where: { entrepriseId: user.entrepriseId },
        include: { entreprise: true, bulletins: true }
      });
    }

    // Autres rôles n'ont pas accès aux cycles de paie
    return [];
  }

  async update(id: number, data: Partial <Omit<CyclePaie,"id">>) : Promise<CyclePaie> {
    try {
      return await mnprisma.cyclePaie.update({ where: { id }, data });
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === 'P2002' && error.meta?.target?.includes('pay_cycles_entrepriseId_nom_key')) {
        const errorMessage = data.nom
          ? `Un cycle de paie avec le nom "${data.nom}" existe déjà pour cette entreprise.`
          : 'Un cycle de paie avec ce nom existe déjà pour cette entreprise.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async delete(id: number) : Promise<void> {
    await mnprisma.cyclePaie.delete({ where: { id } });
  }

  async setStatutValidation(id: number, statutValidation: StatutValidationCycle): Promise<CyclePaie> {
    return mnprisma.cyclePaie.update({ where: { id }, data: { statutValidation } });
  }

  async getBulletinsByCycleId(id: number): Promise<any[]> {
    return mnprisma.bulletin.findMany({
      where: { cycleId: id },
      include: { paiements: true }
    });
  }

};
