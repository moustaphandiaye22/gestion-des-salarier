import type { StatutPaiement } from '@prisma/client';
export declare class BulletinService {
    private bulletinRepository;
    constructor();
    createBulletin(data: any): Promise<{
        id: number;
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
        employeId: number;
    }>;
    getBulletin(id: number): Promise<{
        id: number;
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
        employeId: number;
    } | null>;
    getAllBulletins(user?: any): Promise<{
        id: number;
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
        employeId: number;
    }[]>;
    updateBulletin(id: number, data: any): Promise<{
        id: number;
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
        employeId: number;
    }>;
    deleteBulletin(id: number): Promise<void>;
    setStatutPaiement(id: number, statutPaiement: StatutPaiement, utilisateurId?: number): Promise<{
        id: number;
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
        employeId: number;
    }>;
}
//# sourceMappingURL=bulletinService.d.ts.map