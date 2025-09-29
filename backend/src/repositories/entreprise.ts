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

  async update(id: number, data: Partial<Entreprise>) {
    return mnprisma.entreprise.update({ where: { id }, data });
  }

  async delete(id: number) :Promise<void> {
    await mnprisma.entreprise.delete({ where: { id } });
  }

};
