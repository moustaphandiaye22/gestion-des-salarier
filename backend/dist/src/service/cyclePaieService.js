import { cyclePaieRepository } from '../repositories/cyclePaie.js';
import { cyclePaieSchema } from '../validators/cyclePaie.js';
import { StatutCyclePaie } from '@prisma/client';
// Import the enum for validation status
import { StatutValidationCycle } from '@prisma/client';
export class CyclePaieService {
    cyclePaieRepository;
    constructor() {
        this.cyclePaieRepository = new cyclePaieRepository();
    }
    async createCyclePaie(data) {
        const parsed = cyclePaieSchema.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return await this.cyclePaieRepository.create(data);
    }
    async getCyclePaie(id) {
        return await this.cyclePaieRepository.findById(id);
    }
    async getAllCyclesPaie(user) {
        if (user) {
            return this.cyclePaieRepository.findAllByUser(user);
        }
        return this.cyclePaieRepository.findAll();
    }
    async updateCyclePaie(id, data) {
        const parsed = cyclePaieSchema.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return await this.cyclePaieRepository.update(id, data);
    }
    async deleteCyclePaie(id) {
        return await this.cyclePaieRepository.delete(id);
    }
    async setStatut(id, statut) {
        return await this.cyclePaieRepository.setStatut(id, statut);
    }
    async validateCyclePaie(id, user) {
        // Only ADMIN_ENTREPRISE can validate cycles
        if (user.profil !== 'ADMIN_ENTREPRISE' && user.profil !== 'SUPER_ADMIN') {
            throw new Error('Seul l\'administrateur d\'entreprise peut valider un cycle de paie');
        }
        const cycle = await this.getCyclePaie(id);
        if (!cycle) {
            throw new Error('Cycle de paie non trouvé');
        }
        // Cast cycle to include statutValidation property
        const cycleWithValidation = cycle;
        if (cycleWithValidation.statutValidation !== StatutValidationCycle.BROUILLON) {
            throw new Error('Le cycle de paie n\'est pas en état BROUILLON');
        }
        return await this.cyclePaieRepository.setStatutValidation(id, StatutValidationCycle.VALIDE);
    }
    async closeCyclePaie(id, user) {
        // Only ADMIN_ENTREPRISE can close cycles
        if (user.profil !== 'ADMIN_ENTREPRISE' && user.profil !== 'SUPER_ADMIN') {
            throw new Error('Seul l\'administrateur d\'entreprise peut clôturer un cycle de paie');
        }
        const cycle = await this.getCyclePaie(id);
        if (!cycle) {
            throw new Error('Cycle de paie non trouvé');
        }
        // Cast cycle to include statutValidation property
        const cycleWithValidation = cycle;
        if (cycleWithValidation.statutValidation !== StatutValidationCycle.VALIDE) {
            throw new Error('Le cycle de paie doit être validé avant de pouvoir être clôturé');
        }
        // Check if all payments are completed
        const bulletins = await this.cyclePaieRepository.getBulletinsByCycleId(id);
        const allPaid = bulletins.every(bulletin => bulletin.statutPaiement === 'PAYE');
        if (!allPaid) {
            throw new Error('Tous les paiements doivent être effectués avant de clôturer le cycle');
        }
        return await this.cyclePaieRepository.setStatutValidation(id, StatutValidationCycle.CLOTURE);
    }
    async canCashierPayCycle(id, user) {
        // Only CAISSIER can check this
        if (user.profil !== 'CAISSIER') {
            return false;
        }
        const cycle = await this.getCyclePaie(id);
        if (!cycle) {
            return false;
        }
        // Cast cycle to include statutValidation property
        const cycleWithValidation = cycle;
        // Cashier can only pay validated cycles
        return cycleWithValidation.statutValidation === StatutValidationCycle.VALIDE;
    }
}
//# sourceMappingURL=cyclePaieService.js.map