import type { CyclePaie } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class cyclePaieRepository implements InterfaceRepository<CyclePaie> {
    findByEntreprise(entrepriseId: number): Promise<CyclePaie[]>;
    setEstFerme(id: number, estFerme: boolean): Promise<CyclePaie>;
    create(data: Omit<CyclePaie, "id">): Promise<CyclePaie>;
    findById(id: number): Promise<CyclePaie | null>;
    findAll(): Promise<CyclePaie[]>;
    update(id: number, data: Partial<Omit<CyclePaie, "id">>): Promise<CyclePaie>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=cyclePaie.d.ts.map