import type { StatutPaiement } from '@prisma/client';
export declare class PaiementService {
    private paiementRepository;
    constructor();
    createPaiement(data: any): Promise<{
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        reference: string | null;
        bulletinId: number;
    }>;
    getPaiement(id: number): Promise<{
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        reference: string | null;
        bulletinId: number;
    } | null>;
    getAllPaiements(user?: any): Promise<{
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        reference: string | null;
        bulletinId: number;
    }[]>;
    updatePaiement(id: number, data: any): Promise<{
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        reference: string | null;
        bulletinId: number;
    }>;
    deletePaiement(id: number): Promise<void>;
    setStatut(id: number, statut: StatutPaiement): Promise<{
        id: number;
        entrepriseId: number;
        statut: import("@prisma/client").$Enums.StatutPaiement;
        montant: import("@prisma/client/runtime/library").Decimal;
        datePaiement: Date;
        modePaiement: import("@prisma/client").$Enums.ModePaiement;
        reference: string | null;
        bulletinId: number;
    }>;
}
//# sourceMappingURL=paiementService.d.ts.map