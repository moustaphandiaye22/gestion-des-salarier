import type { TableauDeBord } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class tableauDeBordRepository implements InterfaceRepository<TableauDeBord> {
    create(data: Omit<TableauDeBord, "id"> & {
        configuration: any;
    }): Promise<TableauDeBord>;
    findById(id: number): Promise<TableauDeBord | null>;
    findAll(): Promise<TableauDeBord[]>;
    update(id: number, data: Partial<Omit<TableauDeBord, "id">> & {
        configuration?: any;
    }): Promise<TableauDeBord>;
    delete(id: number): Promise<void>;
    findByEntreprise(entrepriseId: number): Promise<TableauDeBord[]>;
}
//# sourceMappingURL=tableauDeBord.d.ts.map