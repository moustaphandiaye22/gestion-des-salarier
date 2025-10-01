import { ParametreGlobalRepository } from '../repositories/parametreGlobal.js';
const parametreGlobalRepository = new ParametreGlobalRepository();
export class ParametreGlobalService {
    async createParametreGlobal(data) {
        // Vérifier si la clé existe déjà
        const existing = await parametreGlobalRepository.getByKey(data.cle);
        if (existing) {
            throw new Error(`Le paramètre global avec la clé '${data.cle}' existe déjà`);
        }
        return await parametreGlobalRepository.create(data);
    }
    async getAllParametresGlobaux() {
        return await parametreGlobalRepository.getAll();
    }
    async getParametreGlobalById(id) {
        const parametre = await parametreGlobalRepository.getById(id);
        if (!parametre) {
            throw new Error(`Paramètre global avec l'identifiant ${id} non trouvé`);
        }
        return parametre;
    }
    async getParametreGlobalByKey(cle) {
        const parametre = await parametreGlobalRepository.getByKey(cle);
        if (!parametre) {
            throw new Error(`Paramètre global avec la clé '${cle}' non trouvé`);
        }
        return parametre;
    }
    async updateParametreGlobal(id, data) {
        // Vérifier si le paramètre existe
        await this.getParametreGlobalById(id);
        // Si la clé est modifiée, vérifier qu'elle n'existe pas déjà
        if (data.cle) {
            const existing = await parametreGlobalRepository.getByKey(data.cle);
            if (existing && existing.id !== id) {
                throw new Error(`Le paramètre global avec la clé '${data.cle}' existe déjà`);
            }
        }
        return await parametreGlobalRepository.update(id, data);
    }
    async deleteParametreGlobal(id) {
        // Vérifier si le paramètre existe
        await this.getParametreGlobalById(id);
        return await parametreGlobalRepository.delete(id);
    }
    async getParametresByCategory(categorie) {
        return await parametreGlobalRepository.getByCategory(categorie);
    }
    async getParametreValue(cle) {
        try {
            const parametre = await this.getParametreGlobalByKey(cle);
            return parametre.valeur;
        }
        catch (error) {
            return null;
        }
    }
}
//# sourceMappingURL=parametreGlobalService.js.map