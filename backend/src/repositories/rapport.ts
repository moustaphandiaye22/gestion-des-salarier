import { PrismaClient } from "@prisma/client";
import type { Rapport, TypeRapport } from "@prisma/client";
import type { InterfaceRepository } from "./InterfaceRepository.js";
import { mnprisma } from '../config/db.js';


export class rapportRepository implements InterfaceRepository<Rapport> {
    
  async create(data: Omit<Rapport, "id"> & { contenu: any }): Promise<Rapport> {
    return mnprisma.rapport.create({ data });
  }


  async findById(id: number): Promise<Rapport | null> {
    return mnprisma.rapport.findUnique({ where: { id } });
  }

  async findAll(): Promise<Rapport[]> {
    return mnprisma.rapport.findMany({
      orderBy: { id: 'desc' }
    });
  }

  async findAllByUser(user: any): Promise<Rapport[]> {
    // Super Admin voit tous les rapports
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.rapport.findMany({
        orderBy: { id: 'desc' }
      });
    }

    // Admin d'Entreprise et Caissier voient seulement les rapports de leur entreprise
    if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
      return mnprisma.rapport.findMany({
        where: { entrepriseId: user.entrepriseId },
        orderBy: { id: 'desc' }
      });
    }

    // Employé voit seulement les rapports qui le concernent directement
    if (user.profil === 'EMPLOYE' && user.employeId) {
      return mnprisma.rapport.findMany({
        where: {
          typeRapport: 'EMPLOYES' // Pour l'instant, seulement les rapports généraux sur les employés
        },
        orderBy: { id: 'desc' }
      });
    }

    // Autres rôles n'ont pas accès aux rapports
    return [];
  }

  async update(id: number, data: Partial<Omit<Rapport, "id">> & { contenu?: any }): Promise<Rapport> {
    return mnprisma.rapport.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await mnprisma.rapport.delete({ where: { id } });
  }

  async findByType(typeRapport: TypeRapport): Promise<Rapport[]> {
    return mnprisma.rapport.findMany({
      where: { typeRapport },
      orderBy: { id: 'desc' }
    });
  }
}
