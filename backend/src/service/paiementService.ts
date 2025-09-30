import type { StatutPaiement } from '@prisma/client';
import { paiementRepository } from '../repositories/paiement.js';
import { paiementSchema } from '../validators/paiement.js';

export class PaiementService {

    private paiementRepository : paiementRepository

    constructor (){
        this.paiementRepository = new paiementRepository()
    }

  async createPaiement(data: any) {
    const parsed = paiementSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;
   return await this.paiementRepository.create(data);
  }

  async getPaiement(id: number) {
   return await this.paiementRepository.findById(id);
  }

  async getAllPaiements(user?: any) {
    if (user) {
      return this.paiementRepository.findAllByUser(user);
    }
    return this.paiementRepository.findAll();
  }

  async updatePaiement(id: number, data: any) {
    const parsed = paiementSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
   return await this.paiementRepository.update(id, data);
  }

  async deletePaiement(id: number) {
   return await this.paiementRepository.delete(id);
  }

  async setStatut(id: number, statut: StatutPaiement) {
   return await this.paiementRepository.setStatut(id, statut);
  }
}
