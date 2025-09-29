import { employeRepository } from '../repositories/employe.js';
import { employeSchema } from '../validators/employe.js';
export class EmployeService {
    employeRepository;
    constructor() {
        this.employeRepository = new employeRepository();
    }
    async createEmploye(data) {
        const parsed = employeSchema.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return this.employeRepository.create(data);
    }
    async getEmploye(id) {
        return this.employeRepository.findById(id);
    }
    async getAllEmployes() {
        return this.employeRepository.findAll();
    }
    async updateEmploye(id, data) {
        const parsed = employeSchema.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return this.employeRepository.update(id, data);
    }
    async deleteEmploye(id) {
        return this.employeRepository.delete(id);
    }
    async filterEmployes(filters) {
        // Exemples de filtres avancés
        if (filters.statutEmploi)
            return this.employeRepository.findByStatus(filters.statutEmploi);
        if (filters.typeContrat)
            return this.employeRepository.findByTypeContrat(filters.typeContrat);
        if (filters.estActif === true)
            return this.employeRepository.findActifs();
        if (filters.estActif === false)
            return this.employeRepository.findInactifs();
        return this.employeRepository.findAll();
    }
    async setStatus(id, statutEmploi) {
        return this.employeRepository.setStatus(id, statutEmploi);
    }
}
//# sourceMappingURL=employeService.js.map