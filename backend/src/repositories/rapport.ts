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
    return mnprisma.rapport.findMany();
  }

  async update(id: number, data: Partial<Omit<Rapport, "id">> & { contenu?: any }): Promise<Rapport> {
    return mnprisma.rapport.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await mnprisma.rapport.delete({ where: { id } });
  }

  async findByType(typeRapport: TypeRapport): Promise<Rapport[]> {
    return mnprisma.rapport.findMany({ where: { typeRapport } });
  }
}
