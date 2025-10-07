import { PrismaClient } from '@prisma/client';
import type { Entreprise } from "@prisma/client";
import type { Prisma } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
import { mnprisma } from '../config/db.js';

export class entrepriseRepository implements InterfaceRepository<Entreprise> {
  async create(data: Omit<Entreprise, "id">) : Promise<Entreprise> {
    return mnprisma.entreprise.create({ data });
  }

  async findById(id: number) : Promise<Entreprise | null> {
    return mnprisma.entreprise.findUnique({ where: { id } });
  }

  async findByIdForAccessCheck(id: number) {
    return mnprisma.entreprise.findUnique({
      where: { id },
      select: {
        superAdminAccessGranted: true
      }
    });
  }

  async findAll() : Promise<Entreprise[]> {
    return mnprisma.entreprise.findMany({
      orderBy: { id: 'desc' }
    });
  }

  async findAllByUser(user: any) : Promise<Entreprise[]> {
    // Super Admin voit toutes les entreprises
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.entreprise.findMany({
        orderBy: { id: 'desc' }
      });
    }

    // Admin d'Entreprise et Caissier voient seulement leur entreprise
    if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
      return mnprisma.entreprise.findMany({
        where: { id: user.entrepriseId },
        orderBy: { id: 'desc' }
      });
    }

    // Employé voit seulement son entreprise
    if (user.profil === 'EMPLOYE' && user.employeId) {
      const employe = await mnprisma.employe.findUnique({
        where: { id: user.employeId },
        select: { entrepriseId: true }
      });
      if (employe?.entrepriseId) {
        return mnprisma.entreprise.findMany({
          where: { id: employe.entrepriseId }
        });
      }
    }

    // Autres rôles n'ont pas accès aux entreprises
    return [];
  }

  async update(id: number, data: Partial<Omit<Entreprise, "id">>) : Promise<Entreprise> {
    return mnprisma.entreprise.update({ where: { id }, data });
  }

  async delete(id: number) : Promise<void> {
    await mnprisma.entreprise.delete({ where: { id } });
  }

  async setEstActive(id: number, estActive: boolean): Promise<Entreprise> {
    return mnprisma.entreprise.update({ where: { id }, data: { estActive } });
  }
};
