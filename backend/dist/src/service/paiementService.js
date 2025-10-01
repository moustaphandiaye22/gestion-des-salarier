import { paiementRepository } from '../repositories/paiement.js';
import { paiementSchema } from '../validators/paiement.js';
export class PaiementService {
    paiementRepository;
    constructor() {
        this.paiementRepository = new paiementRepository();
    }
    async createPaiement(data) {
        const parsed = paiementSchema.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return await this.paiementRepository.create(data);
    }
    async getPaiement(id) {
        return await this.paiementRepository.findById(id);
    }
    async getAllPaiements(user) {
        if (user) {
            return this.paiementRepository.findAllByUser(user);
        }
        return this.paiementRepository.findAll();
    }
    async updatePaiement(id, data) {
        const parsed = paiementSchema.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return await this.paiementRepository.update(id, data);
    }
    async deletePaiement(id) {
        return await this.paiementRepository.delete(id);
    }
    async setStatut(id, statut) {
        return await this.paiementRepository.setStatut(id, statut);
    }
}
//# sourceMappingURL=paiementService.js.map