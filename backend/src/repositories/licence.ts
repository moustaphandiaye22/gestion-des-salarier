import { PrismaClient, StatutLicence, TypeLicence } from '@prisma/client';

const prisma = new PrismaClient();

export class LicenceRepository {
  async create(data: any) {
    return await prisma.licence.create({ data });
  }

  async getAll() {
    return await prisma.licence.findMany({
      include: { entreprise: true },
      orderBy: { dateDebut: 'desc' }
    });
  }

  async getById(id: number) {
    return await prisma.licence.findUnique({
      where: { id },
      include: { entreprise: true }
    });
  }

  async getByNom(nom: string) {
    return await prisma.licence.findUnique({
      where: { nom },
      include: { entreprise: true }
    });
  }

  async update(id: number, data: any) {
    return await prisma.licence.update({
      where: { id },
      data,
      include: { entreprise: true }
    });
  }

  async delete(id: number) {
    return await prisma.licence.delete({
      where: { id }
    });
  }

  async getByEntreprise(entrepriseId: number) {
    return await prisma.licence.findMany({
      where: { entrepriseId },
      include: { entreprise: true },
      orderBy: { dateDebut: 'desc' }
    });
  }

  async getByStatut(statut: StatutLicence) {
    return await prisma.licence.findMany({
      where: { statut },
      include: { entreprise: true },
      orderBy: { dateDebut: 'desc' }
    });
  }

  async getByType(typeLicence: TypeLicence) {
    return await prisma.licence.findMany({
      where: { typeLicence },
      include: { entreprise: true },
      orderBy: { dateDebut: 'desc' }
    });
  }
}
