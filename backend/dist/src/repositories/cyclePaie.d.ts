import type { CyclePaie, StatutCyclePaie } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class cyclePaieRepository implements InterfaceRepository<CyclePaie> {
    findByEntreprise(entrepriseId: number): Promise<CyclePaie[]>;
    setStatut(id: number, statut: StatutCyclePaie): Promise<CyclePaie>;
    create(data: Omit<CyclePaie, "id">): Promise<CyclePaie>;
    findById(id: number): Promise<CyclePaie | null>;
    findAll(): Promise<CyclePaie[]>;
    findAllByUser(user: any): Promise<CyclePaie[]>;
    update(id: number, data: Partial<Omit<CyclePaie, "id">>): Promise<CyclePaie>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=cyclePaie.d.ts.map