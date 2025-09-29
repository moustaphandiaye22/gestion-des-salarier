import type { Utilisateur } from '@prisma/client';
import type { Prisma, RoleUtilisateur } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class utilisateurRepository implements InterfaceRepository<Utilisateur> {
    create(data: Prisma.UtilisateurCreateInput): Promise<Utilisateur>;
    findById(id: number): Promise<Utilisateur | null>;
    findAll(): Promise<Utilisateur[]>;
    update(id: number, data: Partial<Prisma.UtilisateurCreateInput>): Promise<Utilisateur>;
    delete(id: number): Promise<void>;
    findByRole(role: RoleUtilisateur): Promise<Utilisateur[]>;
    setActif(id: number, estActif: boolean): Promise<Utilisateur>;
    findByEmail(email: string): Promise<Utilisateur | null>;
}
//# sourceMappingURL=utilisateur.d.ts.map