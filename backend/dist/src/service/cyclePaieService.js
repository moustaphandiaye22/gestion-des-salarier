import { cyclePaieRepository } from '../repositories/cyclePaie.js';
import { cyclePaieSchema } from '../validators/cyclePaie.js';
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
    async getAllCyclesPaie() {
        return await this.cyclePaieRepository.findAll();
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
    async setEstFerme(id, estFerme) {
        return await this.cyclePaieRepository.setEstFerme(id, estFerme);
    }
}
//# sourceMappingURL=cyclePaieService.js.map