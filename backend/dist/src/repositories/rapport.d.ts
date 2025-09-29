import type { Rapport, TypeRapport } from "@prisma/client";
import type { InterfaceRepository } from "./InterfaceRepository.js";
export declare class rapportRepository implements InterfaceRepository<Rapport> {
    create(data: Omit<Rapport, "id"> & {
        contenu: any;
    }): Promise<Rapport>;
    findById(id: number): Promise<Rapport | null>;
    findAll(): Promise<Rapport[]>;
    update(id: number, data: Partial<Omit<Rapport, "id">> & {
        contenu?: any;
    }): Promise<Rapport>;
    delete(id: number): Promise<void>;
    findByType(typeRapport: TypeRapport): Promise<Rapport[]>;
}
//# sourceMappingURL=rapport.d.ts.map