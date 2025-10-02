import type { ActionAudit, JournalAudit } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class journalAuditRepository implements InterfaceRepository<JournalAudit> {
    create(data: Omit<JournalAudit, "id"> & {
        details: any;
    }): Promise<JournalAudit>;
    findById(id: number): Promise<JournalAudit | null>;
    findAll(): Promise<JournalAudit[]>;
    update(id: number, data: Partial<Omit<JournalAudit, "id">> & {
        details?: any;
    }): Promise<JournalAudit>;
    delete(id: number): Promise<void>;
    findByAction(action: ActionAudit): Promise<JournalAudit[]>;
    findByUser(utilisateurId: number): Promise<JournalAudit[]>;
    findAllByUser(user: any): Promise<JournalAudit[]>;
}
//# sourceMappingURL=journalAudit.d.ts.map