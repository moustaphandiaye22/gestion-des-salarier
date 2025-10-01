export declare class EntrepriseService {
    private entrepriseRepository;
    constructor();
    createEntreprise(data: any): Promise<{
        id: number;
        nom: string;
        email: string | null;
        telephone: string | null;
        adresse: string | null;
        description: string | null;
        dateCreation: Date;
        logo: string | null;
        estActive: boolean;
    }>;
    getEntreprise(id: number): Promise<({
        paiements: {
            id: number;
            entrepriseId: number;
            statut: import("@prisma/client").$Enums.StatutPaiement;
            montant: import("@prisma/client/runtime/library").Decimal;
            datePaiement: Date;
            modePaiement: import("@prisma/client").$Enums.ModePaiement;
            reference: string | null;
            bulletinId: number;
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
        employes: {
            id: number;
            nom: string;
            email: string | null;
            estActif: boolean;
            entrepriseId: number;
            matricule: string;
            prenom: string;
            telephone: string | null;
            adresse: string | null;
            dateEmbauche: Date;
            statutEmploi: import("@prisma/client").$Enums.StatutEmploi;
            typeContrat: import("@prisma/client").$Enums.TypeContrat;
            typeSalaire: import("@prisma/client").$Enums.TypeSalaire;
            salaireBase: import("@prisma/client/runtime/library").Decimal;
            salaireHoraire: import("@prisma/client/runtime/library").Decimal | null;
            tauxJournalier: import("@prisma/client/runtime/library").Decimal | null;
            allocations: import("@prisma/client/runtime/library").Decimal;
            deductions: import("@prisma/client/runtime/library").Decimal;
            professionId: number | null;
        }[];
        cyclesPaie: {
            id: number;
            nom: string;
            entrepriseId: number;
            description: string | null;
            dateDebut: Date;
            dateFin: Date;
            statut: import("@prisma/client").$Enums.StatutCyclePaie;
            frequence: import("@prisma/client").$Enums.FrequencePaie;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        nom: string;
        email: string | null;
        telephone: string | null;
        adresse: string | null;
        description: string | null;
        dateCreation: Date;
        logo: string | null;
        estActive: boolean;
    }) | null>;
    getAllEntreprises(user?: any): Promise<({
        paiements: {
            id: number;
            entrepriseId: number;
            statut: import("@prisma/client").$Enums.StatutPaiement;
            montant: import("@prisma/client/runtime/library").Decimal;
            datePaiement: Date;
            modePaiement: import("@prisma/client").$Enums.ModePaiement;
            reference: string | null;
            bulletinId: number;
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
        employes: {
            id: number;
            nom: string;
            email: string | null;
            estActif: boolean;
            entrepriseId: number;
            matricule: string;
            prenom: string;
            telephone: string | null;
            adresse: string | null;
            dateEmbauche: Date;
            statutEmploi: import("@prisma/client").$Enums.StatutEmploi;
            typeContrat: import("@prisma/client").$Enums.TypeContrat;
            typeSalaire: import("@prisma/client").$Enums.TypeSalaire;
            salaireBase: import("@prisma/client/runtime/library").Decimal;
            salaireHoraire: import("@prisma/client/runtime/library").Decimal | null;
            tauxJournalier: import("@prisma/client/runtime/library").Decimal | null;
            allocations: import("@prisma/client/runtime/library").Decimal;
            deductions: import("@prisma/client/runtime/library").Decimal;
            professionId: number | null;
        }[];
        cyclesPaie: {
            id: number;
            nom: string;
            entrepriseId: number;
            description: string | null;
            dateDebut: Date;
            dateFin: Date;
            statut: import("@prisma/client").$Enums.StatutCyclePaie;
            frequence: import("@prisma/client").$Enums.FrequencePaie;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        nom: string;
        email: string | null;
        telephone: string | null;
        adresse: string | null;
        description: string | null;
        dateCreation: Date;
        logo: string | null;
        estActive: boolean;
    })[]>;
    updateEntreprise(id: number, data: any): Promise<{
        id: number;
        nom: string;
        email: string | null;
        telephone: string | null;
        adresse: string | null;
        description: string | null;
        dateCreation: Date;
        logo: string | null;
        estActive: boolean;
    }>;
    deleteEntreprise(id: number): Promise<void>;
}
export declare const entrepriseService: EntrepriseService;
//# sourceMappingURL=entrepriseService.d.ts.map