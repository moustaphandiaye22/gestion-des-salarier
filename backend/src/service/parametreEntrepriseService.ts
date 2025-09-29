import { parametreEntrepriseRepository } from '../repositories/parametreEntreprise.js';
import { parametreEntrepriseValidator } from '../validators/parametreEntreprise.js';

export class ParametreEntrepriseService {
  private parametreEntrepriseRepository = new parametreEntrepriseRepository();

  async createParametreEntreprise(data: any) {
    const parsed = parametreEntrepriseValidator.safeParse(data);
    if (!parsed.success) throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
    return this.parametreEntrepriseRepository.create(data);
  }

  async getParametreEntreprise(id: number) {
    const result = await this.parametreEntrepriseRepository.findById(id);
    if (!result) throw new Error(`Aucun paramètre trouvé avec l'identifiant ${id}.`);
    return result;
  }

  async getAllParametresEntreprise() {
    return this.parametreEntrepriseRepository.findAll();
  }

  async updateParametreEntreprise(id: number, data: any) {
    const parsed = parametreEntrepriseValidator.partial().safeParse(data);
    if (!parsed.success) throw new Error('Validation échouée : ' + JSON.stringify(parsed.error.issues));
    const result = await this.parametreEntrepriseRepository.update(id, data);
    if (!result) throw new Error(`Impossible de mettre à jour le paramètre avec l'identifiant ${id}.`);
    return result;
  }

  async deleteParametreEntreprise(id: number) {
    await this.parametreEntrepriseRepository.delete(id);
    return { message: `Paramètre avec l'identifiant ${id} supprimé.` };
  }
}
