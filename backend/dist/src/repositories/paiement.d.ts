import type { Paiement, StatutPaiement } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class paiementRepository implements InterfaceRepository<Paiement> {
    findByBulletin(bulletinId: number): Promise<Paiement[]>;
    setStatut(id: number, statut: StatutPaiement): Promise<Paiement>;
    create(data: Omit<Paiement, "id">): Promise<Paiement>;
    findById(id: number): Promise<Paiement | null>;
    findAll(): Promise<Paiement[]>;
    findAllByUser(user: any): Promise<Paiement[]>;
    update(id: number, data: Partial<Omit<Paiement, "id">>): Promise<Paiement>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=paiement.d.ts.map