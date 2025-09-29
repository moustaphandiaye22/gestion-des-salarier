import type { StatutPaiement } from '@prisma/client';
export declare class BulletinService {
    private bulletinRepository;
    constructor();
    createBulletin(data: any): Promise<{
        id: number;
        employeId: number;
        salaireBase: import("@prisma/client/runtime/library").Decimal;
        allocations: import("@prisma/client/runtime/library").Decimal;
        deductions: import("@prisma/client/runtime/library").Decimal;
        numeroBulletin: string;
        periodeDebut: Date;
        periodeFin: Date;
        totalAPayer: import("@prisma/client/runtime/library").Decimal;
        statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
        dateGeneration: Date;
        cycleId: number;
    }>;
    getBulletin(id: number): Promise<{
        id: number;
        employeId: number;
        salaireBase: import("@prisma/client/runtime/library").Decimal;
        allocations: import("@prisma/client/runtime/library").Decimal;
        deductions: import("@prisma/client/runtime/library").Decimal;
        numeroBulletin: string;
        periodeDebut: Date;
        periodeFin: Date;
        totalAPayer: import("@prisma/client/runtime/library").Decimal;
        statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
        dateGeneration: Date;
        cycleId: number;
    } | null>;
    getAllBulletins(): Promise<{
        id: number;
        employeId: number;
        salaireBase: import("@prisma/client/runtime/library").Decimal;
        allocations: import("@prisma/client/runtime/library").Decimal;
        deductions: import("@prisma/client/runtime/library").Decimal;
        numeroBulletin: string;
        periodeDebut: Date;
        periodeFin: Date;
        totalAPayer: import("@prisma/client/runtime/library").Decimal;
        statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
        dateGeneration: Date;
        cycleId: number;
    }[]>;
    updateBulletin(id: number, data: any): Promise<{
        id: number;
        employeId: number;
        salaireBase: import("@prisma/client/runtime/library").Decimal;
        allocations: import("@prisma/client/runtime/library").Decimal;
        deductions: import("@prisma/client/runtime/library").Decimal;
        numeroBulletin: string;
        periodeDebut: Date;
        periodeFin: Date;
        totalAPayer: import("@prisma/client/runtime/library").Decimal;
        statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
        dateGeneration: Date;
        cycleId: number;
    }>;
    deleteBulletin(id: number): Promise<void>;
    setStatutPaiement(id: number, statutPaiement: StatutPaiement, utilisateurId?: number): Promise<{
        id: number;
        employeId: number;
        salaireBase: import("@prisma/client/runtime/library").Decimal;
        allocations: import("@prisma/client/runtime/library").Decimal;
        deductions: import("@prisma/client/runtime/library").Decimal;
        numeroBulletin: string;
        periodeDebut: Date;
        periodeFin: Date;
        totalAPayer: import("@prisma/client/runtime/library").Decimal;
        statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
        dateGeneration: Date;
        cycleId: number;
    }>;
}
//# sourceMappingURL=bulletinService.d.ts.map