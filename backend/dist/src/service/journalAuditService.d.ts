export declare class JournalAuditService {
    private journalAuditRepository;
    createJournalAudit(data: any): Promise<{
        id: number;
        entrepriseId: number | null;
        bulletinId: number | null;
        employeId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        utilisateurId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
    }>;
    getJournalAudit(id: number): Promise<{
        id: number;
        entrepriseId: number | null;
        bulletinId: number | null;
        employeId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        utilisateurId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
    } | null>;
    getAllJournalAudits(): Promise<{
        id: number;
        entrepriseId: number | null;
        bulletinId: number | null;
        employeId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        utilisateurId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
    }[]>;
    updateJournalAudit(id: number, data: any): Promise<{
        id: number;
        entrepriseId: number | null;
        bulletinId: number | null;
        employeId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        utilisateurId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
    }>;
    deleteJournalAudit(id: number): Promise<void>;
}
export declare const journalAuditService: JournalAuditService;
//# sourceMappingURL=journalAuditService.d.ts.map