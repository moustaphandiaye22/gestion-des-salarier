import type { StatutPaiement } from '@prisma/client';
export declare class PaiementService {
    private paiementRepository;
    constructor();
    createPaiement(data: any): Promise<{
        id: number;
        entrepriseId: number;
        bulletinId: number;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        reference: string | null;
    }>;
    getPaiement(id: number): Promise<{
        id: number;
        entrepriseId: number;
        bulletinId: number;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        reference: string | null;
    } | null>;
    getAllPaiements(): Promise<{
        id: number;
        entrepriseId: number;
        bulletinId: number;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        reference: string | null;
    }[]>;
    updatePaiement(id: number, data: any): Promise<{
        id: number;
        entrepriseId: number;
        bulletinId: number;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        reference: string | null;
    }>;
    deletePaiement(id: number): Promise<void>;
    setStatut(id: number, statut: StatutPaiement): Promise<{
        id: number;
        entrepriseId: number;
        bulletinId: number;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        reference: string | null;
    }>;
}
//# sourceMappingURL=paiementService.d.ts.map