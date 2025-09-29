export declare class JournalAuditService {
    private journalAuditRepository;
    createJournalAudit(data: any): Promise<{
        id: number;
        entrepriseId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        employeId: number | null;
        bulletinId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
        utilisateurId: number | null;
    }>;
    getJournalAudit(id: number): Promise<{
        id: number;
        entrepriseId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        employeId: number | null;
        bulletinId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
        utilisateurId: number | null;
    } | null>;
    getAllJournalAudits(): Promise<{
        id: number;
        entrepriseId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        employeId: number | null;
        bulletinId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
        utilisateurId: number | null;
    }[]>;
    updateJournalAudit(id: number, data: any): Promise<{
        id: number;
        entrepriseId: number | null;
        action: import("@prisma/client").$Enums.ActionAudit;
        details: import("@prisma/client/runtime/library").JsonValue;
        dateAction: Date;
        employeId: number | null;
        bulletinId: number | null;
        paiementId: number | null;
        cyclePaieId: number | null;
        utilisateurId: number | null;
    }>;
    deleteJournalAudit(id: number): Promise<void>;
}
export declare const journalAuditService: JournalAuditService;
//# sourceMappingURL=journalAuditService.d.ts.map