import { PrismaClient } from '@prisma/client';
import type { ParametreEntreprise } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
import { mnprisma } from '../config/db.js';


export class parametreEntrepriseRepository implements InterfaceRepository<ParametreEntreprise> {
    
  async create(data: Omit<ParametreEntreprise, "id">): Promise<ParametreEntreprise> {
    return mnprisma.parametreEntreprise.create({ data });
  }


  async findById(id: number): Promise<ParametreEntreprise | null> {
    return mnprisma.parametreEntreprise.findUnique({ where: { id } });
  }


  async findAll(): Promise<ParametreEntreprise[]> {
    return mnprisma.parametreEntreprise.findMany();
  }

  async findAllByUser(user: any): Promise<ParametreEntreprise[]> {
    // Super Admin voit tous les paramètres d'entreprise
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.parametreEntreprise.findMany();
    }

    // Admin d'Entreprise voit seulement les paramètres de son entreprise
    if (user.profil === 'ADMIN_ENTREPRISE' && user.entrepriseId) {
      return mnprisma.parametreEntreprise.findMany({
        where: { entrepriseId: user.entrepriseId }
      });
    }

    // Autres rôles n'ont pas accès aux paramètres d'entreprise
    return [];
  }

  async update(id: number, data: Partial<Omit<ParametreEntreprise, "id">>): Promise<ParametreEntreprise> {
    return mnprisma.parametreEntreprise.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await mnprisma.parametreEntreprise.delete({ where: { id } });
  }

  async findByCle(cle: string): Promise<ParametreEntreprise[]> {
    return mnprisma.parametreEntreprise.findMany({ where: { cle } });
  }

  async findByEntreprise(entrepriseId: number): Promise<ParametreEntreprise[]> {
    return mnprisma.parametreEntreprise.findMany({ where: { entrepriseId } });
  }

}
