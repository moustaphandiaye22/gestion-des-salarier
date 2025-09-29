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
