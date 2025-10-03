import { PrismaClient, Prisma } from '@prisma/client';
import type { Bulletin, StatutPaiement } from "@prisma/client"
import { mnprisma } from '../config/db.js';
import type { InterfaceRepository } from './InterfaceRepository.js';



export class bulletinRepository implements InterfaceRepository<Bulletin> {

  async findByEmploye(employeId: number): Promise<Bulletin[]> {
    return mnprisma.bulletin.findMany({ where: { employeId }, include: { employe: true, cycle: true, paiements: true } });
  }

  async findByCycle(cycleId: number): Promise<Bulletin[]> {
  return mnprisma.bulletin.findMany({ where: { cycleId }, include: { employe: true, cycle: true, paiements: true } });
  }

  async findByEmployeeAndCycle(employeId: number, cycleId: number): Promise<Bulletin | null> {
    return mnprisma.bulletin.findFirst({
      where: {
        employeId,
        cycleId
      },
      include: { employe: true, cycle: true, paiements: true }
    });
  }

  async setStatutPaiement(id: number, statutPaiement: StatutPaiement): Promise<Bulletin> {
    return mnprisma.bulletin.update({ where: { id }, data: { statutPaiement } });
  }
    
  async create(data: Omit<Bulletin,"id">) : Promise<Bulletin> {
    return mnprisma.bulletin.create({ data});
  }

  async findById(id: number): Promise<Bulletin | null> {
  return mnprisma.bulletin.findUnique({ where: { id }, include: { employe: true, cycle: true, paiements: true } });
  }

  async findAll() : Promise<Bulletin[]> {
  return mnprisma.bulletin.findMany({ include: { employe: true, cycle: true, paiements: true } });
  }

  async findAllByUser(user: any) : Promise<Bulletin[]> {
    // Super Admin voit tous les bulletins
    if (user.profil === 'SUPER_ADMIN') {
      return mnprisma.bulletin.findMany({
        include: { employe: true, cycle: true, paiements: true }
      });
    }

    // Admin d'Entreprise et Caissier voient seulement les bulletins de leur entreprise
    if ((user.profil === 'ADMIN_ENTREPRISE' || user.profil === 'CAISSIER') && user.entrepriseId) {
      return mnprisma.bulletin.findMany({
        where: {
          employe: {
            entrepriseId: user.entrepriseId
          }
        },
        include: { employe: true, cycle: true, paiements: true }
      });
    }

    // Autres rôles n'ont pas accès aux bulletins
    return [];
  }

  async update(id: number, data: Partial <Omit<Bulletin,"id">>) {
    return mnprisma.bulletin.update({ where: { id }, data });
  }

  async delete(id: number) : Promise<void> {
    await mnprisma.bulletin.delete({ where: { id } });
  }


};
