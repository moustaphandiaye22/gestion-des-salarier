import type { Utilisateur } from '@prisma/client';
import type { RoleUtilisateur } from '@prisma/client';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
export declare class utilisateurRepository implements IUserRepository {
    create(data: any): Promise<Utilisateur>;
    findById(id: number): Promise<Utilisateur | null>;
    findAll(): Promise<Utilisateur[]>;
    update(id: number, data: any): Promise<Utilisateur | null>;
    delete(id: number): Promise<void>;
    findByRole(role: RoleUtilisateur): Promise<Utilisateur[]>;
    setActif(id: number, estActif: boolean): Promise<Utilisateur>;
    findByEmail(email: string): Promise<Utilisateur | null>;
    findByEntreprise(entrepriseId: number): Promise<Utilisateur[]>;
}
//# sourceMappingURL=utilisateur.d.ts.map