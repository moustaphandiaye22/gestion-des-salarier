import { PrismaClient } from '@prisma/client';
import type { TableauDeBord } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
import { mnprisma } from '../config/db.js';

export class tableauDeBordRepository implements InterfaceRepository<TableauDeBord> {

  async create(data: Omit<TableauDeBord, "id"> & { configuration: any }): Promise<TableauDeBord> {
    return mnprisma.tableauDeBord.create({ data });
  }



  async findById(id: number): Promise<TableauDeBord | null> {
    return mnprisma.tableauDeBord.findUnique({ where: { id } });
  }

  async findAll(): Promise<TableauDeBord[]> {
    return mnprisma.tableauDeBord.findMany();
  }

  async update(id: number, data: Partial<Omit<TableauDeBord, "id">> & { configuration?: any }): Promise<TableauDeBord> {
    return mnprisma.tableauDeBord.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await mnprisma.tableauDeBord.delete({ where: { id } });
  }

  async findByEntreprise(entrepriseId: number): Promise<TableauDeBord[]> {
    return mnprisma.tableauDeBord.findMany({ where: { entrepriseId } });
  }
}
