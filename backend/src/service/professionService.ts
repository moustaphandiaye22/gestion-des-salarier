import { PrismaClient } from '@prisma/client';
import { CustomError } from '../errors/CustomError.js';

const prisma = new PrismaClient();

export class ProfessionService {
  async getAll() {
    return prisma.profession.findMany({
      where: { estActive: true },
      orderBy: { nom: 'asc' },
    });
  }

  async getById(id: number) {
    const profession = await prisma.profession.findUnique({ where: { id } });
    if (!profession) {
      throw new CustomError('Profession non trouvée', 404);
    }
    return profession;
  }

  async create(data: { nom: string; description?: string; categorie?: string }) {
    return prisma.profession.create({ data });
  }

  async update(id: number, data: { nom?: string; description?: string; categorie?: string; estActive?: boolean }) {
    await this.getById(id);
    return prisma.profession.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.getById(id);
    return prisma.profession.update({ where: { id }, data: { estActive: false } });
  }
}
