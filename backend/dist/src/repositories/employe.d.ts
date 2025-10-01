import type { Employe, StatutEmploi, TypeContrat } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class employeRepository implements InterfaceRepository<Employe> {
    findByStatus(statutEmploi: StatutEmploi): Promise<Employe[]>;
    findByTypeContrat(typeContrat: TypeContrat): Promise<Employe[]>;
    findActifs(): Promise<Employe[]>;
    findInactifs(): Promise<Employe[]>;
    setStatus(id: number, statutEmploi: StatutEmploi): Promise<Employe>;
    create(data: Omit<Employe, "id">): Promise<Employe>;
    findById(id: number): Promise<Employe | null>;
    findAll(): Promise<Employe[]>;
    findAllByUser(user: any): Promise<Employe[]>;
    update(id: number, data: Partial<Omit<Employe, "id">>): Promise<Employe>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=employe.d.ts.map