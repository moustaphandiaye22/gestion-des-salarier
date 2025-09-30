import { PrismaClient } from '@prisma/client';
import type { Employe, StatutEmploi, TypeContrat } from "@prisma/client";
import type { Prisma } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
import { mnprisma } from '../config/db.js';

export class employeRepository implements InterfaceRepository<Employe> {
  async findByStatus(statutEmploi: StatutEmploi): Promise<Employe[]> {
    return mnprisma.employe.findMany({ where: { statutEmploi }, include: { entreprise: true, bulletins: true, profession: true } });
  }

  async findByTypeContrat(typeContrat: TypeContrat): Promise<Employe[]> {
  return mnprisma.employe.findMany({ where: { typeContrat }, include: { entreprise: true, bulletins: true, profession: true } });
  }

//   async findByPoste(poste: Poste): Promise<Employe[]> {
//   return prisma.employe.findMany({ where: { poste }, include: { entreprise: true, bulletins: true } });
//   }

  async findActifs(): Promise<Employe[]> {
  return mnprisma.employe.findMany({ where: { estActif: true }, include: { entreprise: true, bulletins: true, profession: true } });
  }

  async findInactifs(): Promise<Employe[]> {
    return mnprisma.employe.findMany({ where: { estActif: false }, include: { entreprise: true, bulletins: true, profession: true } });
  }

  async setStatus(id: number, statutEmploi: StatutEmploi): Promise<Employe> {
        return mnprisma.employe.update({ where: { id }, data: { statutEmploi } });
  }

  async create(data: Omit<Employe, "id">) : Promise<Employe> {
    return mnprisma.employe.create({ data });
  }
  async findById(id: number) : Promise<Employe | null> {
  return mnprisma.employe.findUnique({ where: { id }, include: { entreprise: true, bulletins: true, profession: true } });
  }


  async findAll() : Promise<Employe[]> {
  return mnprisma.employe.findMany({ include: { entreprise: true, bulletins: true, profession: true } });
  }

  async findAllByUser(user: any) : Promise<Employe[]> {
    // Super Admin voit tous les employés
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.employe.findMany({
        include: { entreprise: true, bulletins: true, profession: true }
      });
    }

    // Admin d'Entreprise voit seulement les employés de son entreprise
    if (user.profil === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
      return mnprisma.employe.findMany({
        where: { entrepriseId: user.entrepriseId },
        include: { entreprise: true, bulletins: true, profession: true }
      });
    }

    // Autres rôles n'ont pas accès à la liste des employés
    return [];
  }

  async update(id: number, data: Partial <Omit<Employe,"id">>) : Promise<Employe> {
    return mnprisma.employe.update({ where: { id }, data });
  }

  async delete(id: number) : Promise<void> {
    await mnprisma.employe.delete({ where: { id } });
  }

};
