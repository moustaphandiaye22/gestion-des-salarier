import { entrepriseRepository } from '../repositories/entreprise.js';
import { entrepriseSchema } from '../validators/entreprise.js';

export class EntrepriseService {

    private entrepriseRepository : entrepriseRepository

    constructor(){

        this.entrepriseRepository = new entrepriseRepository()
    }

  async createEntreprise(data: any) {
    const parsed = entrepriseSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;
    return  await  this.entrepriseRepository.create(data);
  }

  async getEntreprise(id: number) {
    return await this.entrepriseRepository.findById(id);
  }

  async getAllEntreprises() {
    return await this.entrepriseRepository.findAll();
  }

  async updateEntreprise(id: number, data: any) {
    const parsed = entrepriseSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
    return await this.entrepriseRepository.update(id, data);
  }

  async deleteEntreprise(id: number) {
    return await this.entrepriseRepository.delete(id);
  }
}

export const entrepriseService = new EntrepriseService();
