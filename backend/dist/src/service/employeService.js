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
    async getAllEmployes(user, entrepriseId) {
        if (user) {
            return this.employeRepository.findAllByUser(user, entrepriseId);
        }
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
    async bulkCreateEmployes(employes) {
        const results = {
            success: [],
            errors: []
        };
        for (let i = 0; i < employes.length; i++) {
            const data = employes[i];
            const parsed = employeSchema.safeParse(data);
            if (!parsed.success) {
                results.errors.push({ index: i, errors: parsed.error.issues });
                continue;
            }
            try {
                const created = await this.employeRepository.create(data);
                results.success.push(created);
            }
            catch (err) {
                results.errors.push({ index: i, errors: [{ message: err.message }] });
            }
        }
        return results;
    }
}
//# sourceMappingURL=employeService.js.map