import { tableauDeBordRepository } from '../repositories/tableauDeBord.js';
import { tableauDeBordValidator } from '../validators/tableauDeBord.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TableauDeBordService {
  private tableauDeBordRepository = new tableauDeBordRepository();

  async createTableauDeBord(data: any) {
    const parsed = tableauDeBordValidator.safeParse(data);
    if (!parsed.success) throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
    return this.tableauDeBordRepository.create(data);
  }

  async getTableauDeBord(id: number) {
    const result = await this.tableauDeBordRepository.findById(id);
    if (!result) throw new Error(`Aucun tableau de bord trouvé avec l'identifiant ${id}.`);
    return result;
  }

  async getAllTableauxDeBord() {
    return this.tableauDeBordRepository.findAll();
  }

  async updateTableauDeBord(id: number, data: any) {
    const parsed = tableauDeBordValidator.partial().safeParse(data);
    if (!parsed.success) throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
    const result = await this.tableauDeBordRepository.update(id, data);
    if (!result) throw new Error(`Impossible de mettre à jour le tableau de bord avec l'identifiant ${id}.`);
    return result;
  }

  async deleteTableauDeBord(id: number) {
    await this.tableauDeBordRepository.delete(id);
    return { message: `Tableau de bord avec l'identifiant ${id} supprimé.` };
  }
}

export const tableauDeBordService = new TableauDeBordService();
