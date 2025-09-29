import { rapportRepository } from '../repositories/rapport.js';
import { rapportValidator } from '../validators/rapport.js';
export class RapportService {
    rapportRepository = new rapportRepository();
    async createRapport(data) {
        const parsed = rapportValidator.safeParse(data);
        if (!parsed.success)
            throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
        return this.rapportRepository.create(data);
    }
    async getRapport(id) {
        const result = await this.rapportRepository.findById(id);
        if (!result)
            throw new Error(`Aucun rapport trouvé avec l'identifiant ${id}.`);
        return result;
    }
    async getAllRapports() {
        return this.rapportRepository.findAll();
    }
    async updateRapport(id, data) {
        const parsed = rapportValidator.partial().safeParse(data);
        if (!parsed.success)
            throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
        const result = await this.rapportRepository.update(id, data);
        if (!result)
            throw new Error(`Impossible de mettre à jour le rapport avec l'identifiant ${id}.`);
        return result;
    }
    async deleteRapport(id) {
        await this.rapportRepository.delete(id);
        return { message: `Rapport avec l'identifiant ${id} supprimé.` };
    }
}
export const rapportService = new RapportService();
//# sourceMappingURL=rapportService.js.map