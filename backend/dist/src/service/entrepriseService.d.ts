export declare class EntrepriseService {
    private entrepriseRepository;
    constructor();
    createEntreprise(data: any): Promise<{
        id: number;
        nom: string;
        email: string | null;
        description: string | null;
        adresse: string | null;
        telephone: string | null;
        estActive: boolean;
        dateCreation: Date;
    }>;
    getEntreprise(id: number): Promise<({
        employes: {
            id: number;
            nom: string;
            email: string | null;
            estActif: boolean;
            entrepriseId: number;
            adresse: string | null;
            telephone: string | null;
            matricule: string;
            prenom: string;
            dateEmbauche: Date;
            statutEmploi: import("@prisma/client").$Enums.StatutEmploi;
            typeContrat: import("@prisma/client").$Enums.TypeContrat;
            salaireBase: import("@prisma/client/runtime/library").Decimal;
            allocations: import("@prisma/client/runtime/library").Decimal;
            deductions: import("@prisma/client/runtime/library").Decimal;
        }[];
        cyclesPaie: {
            id: number;
            entrepriseId: number;
            dateCreation: Date;
            periodeDebut: Date;
            periodeFin: Date;
            typeCycle: import("@prisma/client").$Enums.TypeCyclePaie;
            estFerme: boolean;
        }[];
        paiements: {
            id: number;
            entrepriseId: number;
            bulletinId: number;
            montant: import("@prisma/client/runtime/library").Decimal;
            datePaiement: Date;
            modePaiement: import("@prisma/client").$Enums.ModePaiement;
            statut: import("@prisma/client").$Enums.StatutPaiement;
            reference: string | null;
        }[];
        utilisateurs: {
            id: number;
            nom: string;
            email: string;
            motDePasse: string;
            role: import("@prisma/client").$Enums.RoleUtilisateur;
            estActif: boolean;
            entrepriseId: number | null;
        }[];
    } & {
        id: number;
        nom: string;
        email: string | null;
        description: string | null;
        adresse: string | null;
        telephone: string | null;
        estActive: boolean;
        dateCreation: Date;
    }) | null>;
    getAllEntreprises(): Promise<({
        employes: {
            id: number;
            nom: string;
            email: string | null;
            estActif: boolean;
            entrepriseId: number;
            adresse: string | null;
            telephone: string | null;
            matricule: string;
            prenom: string;
            dateEmbauche: Date;
            statutEmploi: import("@prisma/client").$Enums.StatutEmploi;
            typeContrat: import("@prisma/client").$Enums.TypeContrat;
            salaireBase: import("@prisma/client/runtime/library").Decimal;
            allocations: import("@prisma/client/runtime/library").Decimal;
            deductions: import("@prisma/client/runtime/library").Decimal;
        }[];
        cyclesPaie: {
            id: number;
            entrepriseId: number;
            dateCreation: Date;
            periodeDebut: Date;
            periodeFin: Date;
            typeCycle: import("@prisma/client").$Enums.TypeCyclePaie;
            estFerme: boolean;
        }[];
        paiements: {
            id: number;
            entrepriseId: number;
            bulletinId: number;
            montant: import("@prisma/client/runtime/library").Decimal;
            datePaiement: Date;
            modePaiement: import("@prisma/client").$Enums.ModePaiement;
            statut: import("@prisma/client").$Enums.StatutPaiement;
            reference: string | null;
        }[];
        utilisateurs: {
            id: number;
            nom: string;
            email: string;
            motDePasse: string;
            role: import("@prisma/client").$Enums.RoleUtilisateur;
            estActif: boolean;
            entrepriseId: number | null;
        }[];
    } & {
        id: number;
        nom: string;
        email: string | null;
        description: string | null;
        adresse: string | null;
        telephone: string | null;
        estActive: boolean;
        dateCreation: Date;
    })[]>;
    updateEntreprise(id: number, data: any): Promise<{
        id: number;
        nom: string;
        email: string | null;
        description: string | null;
        adresse: string | null;
        telephone: string | null;
        estActive: boolean;
        dateCreation: Date;
    }>;
    deleteEntreprise(id: number): Promise<void>;
}
export declare const entrepriseService: EntrepriseService;
//# sourceMappingURL=entrepriseService.d.ts.map