import { PrismaClient } from '@prisma/client';
import type { ParametreGlobal } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';

const prisma = new PrismaClient();

export class ParametreGlobalRepository implements InterfaceRepository<ParametreGlobal> {
  async findAll(): Promise<ParametreGlobal[]> {
    return await prisma.parametreGlobal.findMany({
      orderBy: { categorie: 'asc' }
    });
  }

  async findById(id: number): Promise<ParametreGlobal | null> {
    return await prisma.parametreGlobal.findUnique({
      where: { id }
    });
  }
  async create(data: any) {
    return await prisma.parametreGlobal.create({ data });
  }

  async getAll() {
    return await prisma.parametreGlobal.findMany({
      orderBy: { categorie: 'asc' }
    });
  }

  async getById(id: number) {
    return await prisma.parametreGlobal.findUnique({
      where: { id }
    });
  }

  async getByKey(cle: string) {
    return await prisma.parametreGlobal.findUnique({
      where: { cle }
    });
  }

  async update(id: number, data: any) {
    return await prisma.parametreGlobal.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.parametreGlobal.delete({
      where: { id }
    });
  }

  async getByCategory(categorie: string) {
    return await prisma.parametreGlobal.findMany({
      where: { categorie },
      orderBy: { cle: 'asc' }
    });
  }
}
