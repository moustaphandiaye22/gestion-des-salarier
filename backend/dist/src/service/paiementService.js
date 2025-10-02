import { paiementRepository } from '../repositories/paiement.js';
import { bulletinRepository } from '../repositories/bulletin.js';
import { paiementSchema } from '../validators/paiement.js';
export class PaiementService {
    paiementRepository;
    bulletinRepository;
    constructor() {
        this.paiementRepository = new paiementRepository();
        this.bulletinRepository = new bulletinRepository();
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
        const updatedPaiement = await this.paiementRepository.update(id, data);
        // If the payment status was changed to PAYE, check if all payments for the bulletin are now PAYE
        if (data.statut === 'PAYE') {
            const bulletin = await this.bulletinRepository.findById(updatedPaiement.bulletinId);
            if (bulletin) {
                const allPayments = await this.paiementRepository.findByBulletin(bulletin.id);
                const allPaymentsPaye = allPayments.every(p => p.statut === 'PAYE');
                if (allPaymentsPaye && bulletin.statutPaiement !== 'PAYE') {
                    await this.bulletinRepository.setStatutPaiement(bulletin.id, 'PAYE');
                }
            }
        }
        return updatedPaiement;
    }
    async deletePaiement(id) {
        return await this.paiementRepository.delete(id);
    }
    async setStatut(id, statut) {
        return await this.paiementRepository.setStatut(id, statut);
    }
}
//# sourceMappingURL=paiementService.js.map