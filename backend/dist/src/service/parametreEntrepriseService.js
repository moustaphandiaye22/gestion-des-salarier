import { parametreEntrepriseRepository } from '../repositories/parametreEntreprise.js';
import { parametreEntrepriseValidator } from '../validators/parametreEntreprise.js';
export class ParametreEntrepriseService {
    parametreEntrepriseRepository = new parametreEntrepriseRepository();
    async createParametreEntreprise(data) {
        const parsed = parametreEntrepriseValidator.safeParse(data);
        if (!parsed.success)
            throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
        return this.parametreEntrepriseRepository.create(data);
    }
    async getParametreEntreprise(id) {
        const result = await this.parametreEntrepriseRepository.findById(id);
        if (!result)
            throw new Error(`Aucun paramètre trouvé avec l'identifiant ${id}.`);
        return result;
    }
    async getAllParametresEntreprise(user) {
        if (user) {
            return this.parametreEntrepriseRepository.findAllByUser(user);
        }
        return this.parametreEntrepriseRepository.findAll();
    }
    async updateParametreEntreprise(id, data) {
        const parsed = parametreEntrepriseValidator.partial().safeParse(data);
        if (!parsed.success)
            throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
        const result = await this.parametreEntrepriseRepository.update(id, data);
        if (!result)
            throw new Error(`Impossible de mettre à jour le paramètre avec l'identifiant ${id}.`);
        return result;
    }
    async deleteParametreEntreprise(id) {
        await this.parametreEntrepriseRepository.delete(id);
        return { message: `Paramètre avec l'identifiant ${id} supprimé.` };
    }
}
//# sourceMappingURL=parametreEntrepriseService.js.map