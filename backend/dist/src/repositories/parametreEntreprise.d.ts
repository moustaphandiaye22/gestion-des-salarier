import type { ParametreEntreprise } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class parametreEntrepriseRepository implements InterfaceRepository<ParametreEntreprise> {
    create(data: Omit<ParametreEntreprise, "id">): Promise<ParametreEntreprise>;
    findById(id: number): Promise<ParametreEntreprise | null>;
    findAll(): Promise<ParametreEntreprise[]>;
    findAllByUser(user: any): Promise<ParametreEntreprise[]>;
    update(id: number, data: Partial<Omit<ParametreEntreprise, "id">>): Promise<ParametreEntreprise>;
    delete(id: number): Promise<void>;
    findByCle(cle: string): Promise<ParametreEntreprise[]>;
    findByEntreprise(entrepriseId: number): Promise<ParametreEntreprise[]>;
}
//# sourceMappingURL=parametreEntreprise.d.ts.map