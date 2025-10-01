import type { Utilisateur } from '@prisma/client';
export interface IUserRepository {
    create(data: any): Promise<Utilisateur>;
    findAll(): Promise<Utilisateur[]>;
    findById(id: number): Promise<Utilisateur | null>;
    findByEmail(email: string): Promise<Utilisateur | null>;
    findByEntreprise(entrepriseId: number): Promise<Utilisateur[]>;
    update(id: number, data: any): Promise<Utilisateur | null>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=IUserRepository.d.ts.map