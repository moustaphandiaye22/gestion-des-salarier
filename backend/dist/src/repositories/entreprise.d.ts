import type { Entreprise } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class entrepriseRepository implements InterfaceRepository<Entreprise> {
    create(data: Omit<Entreprise, "id">): Promise<Entreprise>;
    findById(id: number): Promise<Entreprise | null>;
    findByIdForAccessCheck(id: number): Promise<{
        superAdminAccessGranted: boolean;
    } | null>;
    findAll(): Promise<Entreprise[]>;
    findAllByUser(user: any): Promise<Entreprise[]>;
    update(id: number, data: Partial<Omit<Entreprise, "id">>): Promise<Entreprise>;
    delete(id: number): Promise<void>;
    setEstActive(id: number, estActive: boolean): Promise<Entreprise>;
}
//# sourceMappingURL=entreprise.d.ts.map