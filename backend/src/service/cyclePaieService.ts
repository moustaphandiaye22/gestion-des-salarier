import { cyclePaieRepository } from '../repositories/cyclePaie.js';
import { cyclePaieSchema } from '../validators/cyclePaie.js';

export class CyclePaieService {

    private  cyclePaieRepository : cyclePaieRepository

    constructor (){
        this.cyclePaieRepository = new cyclePaieRepository()

    }

  async createCyclePaie(data: any) {
    const parsed = cyclePaieSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;
   return await this.cyclePaieRepository.create(data);
  }

  async getCyclePaie(id: number) {
   return await this.cyclePaieRepository.findById(id);
  }

  async getAllCyclesPaie() {
   return await this.cyclePaieRepository.findAll();
  }

  async updateCyclePaie(id: number, data: any) {
    const parsed = cyclePaieSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
   return await this.cyclePaieRepository.update(id, data);
  }

  async deleteCyclePaie(id: number) {
   return await this.cyclePaieRepository.delete(id);
  }

  async setEstFerme(id: number, estFerme: boolean) {
   return await this.cyclePaieRepository.setEstFerme(id, estFerme);
  }
}
