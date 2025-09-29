import { utilisateurRepository } from '../repositories/utilisateur.js';
import { utilisateurValidator } from '../validators/utilisateur.js';
import { AuthUtils } from '../auth/authUtils.js';
export class UtilisateurService {
    utilisateurRepository = new utilisateurRepository();
    async createUtilisateur(data) {
        const parsed = utilisateurValidator.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        // Hash password
        if (data.motDePasse) {
            data.motDePasse = await AuthUtils.hashPassword(data.motDePasse);
        }
        return this.utilisateurRepository.create(data);
    }
    async getUtilisateur(id) {
        return this.utilisateurRepository.findById(id);
    }
    async getAllUtilisateurs() {
        return this.utilisateurRepository.findAll();
    }
    async updateUtilisateur(id, data) {
        const parsed = utilisateurValidator.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        // Hash password if provided
        if (data.motDePasse) {
            data.motDePasse = await AuthUtils.hashPassword(data.motDePasse);
        }
        return this.utilisateurRepository.update(id, data);
    }
    async deleteUtilisateur(id) {
        return this.utilisateurRepository.delete(id);
    }
}
export const utilisateurService = new UtilisateurService();
//# sourceMappingURL=utilisateurService.js.map