import { employeRepository } from '../repositories/employe.js';
import { employeSchema } from '../validators/employe.js';
import type { StatutEmploi, TypeContrat } from '@prisma/client';

export class EmployeService {

    private employeRepository : employeRepository

    constructor(){
        this.employeRepository = new employeRepository()
    }

  async createEmploye(data: any) {
    const parsed = employeSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;
   return this.employeRepository.create(data);
  }

  async getEmploye(id: number) {
   return this.employeRepository.findById(id); 
  }

    async getAllEmployes(user?: any) {
    if (user) {
      return this.employeRepository.findAllByUser(user);
    }
    return this.employeRepository.findAll();
  }

  async updateEmploye(id: number, data: any) {
    const parsed = employeSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
   return this.employeRepository.update(id, data); 
  }

  async deleteEmploye(id: number) {
   return this.employeRepository.delete(id); 
  }

  async filterEmployes(filters: any) {
    // Exemples de filtres avancés
    if (filters.statutEmploi) return this.employeRepository.findByStatus(filters.statutEmploi as StatutEmploi);
    if (filters.typeContrat) return this.employeRepository.findByTypeContrat(filters.typeContrat as TypeContrat);
    if (filters.estActif === true) return this.employeRepository.findActifs();
    if (filters.estActif === false) return this.employeRepository.findInactifs();
    return this.employeRepository.findAll();
  }

  async setStatus(id: number, statutEmploi: StatutEmploi) {
        return this.employeRepository.setStatus(id, statutEmploi);
  }
}
