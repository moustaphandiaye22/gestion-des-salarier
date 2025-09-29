import { Prisma } from '@prisma/client';
import type { Entreprise } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class entrepriseRepository implements InterfaceRepository<Entreprise> {
    setEstActive(id: number, estActive: boolean): Promise<Entreprise>;
    create(data: Omit<Entreprise, "id">): Promise<Entreprise>;
    findById(id: number): Promise<({
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
            salaireBase: Prisma.Decimal;
            allocations: Prisma.Decimal;
            deductions: Prisma.Decimal;
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
            montant: Prisma.Decimal;
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
    findAll(): Promise<({
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
            salaireBase: Prisma.Decimal;
            allocations: Prisma.Decimal;
            deductions: Prisma.Decimal;
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
            montant: Prisma.Decimal;
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
    update(id: number, data: Partial<Entreprise>): Promise<{
        id: number;
        nom: string;
        email: string | null;
        description: string | null;
        adresse: string | null;
        telephone: string | null;
        estActive: boolean;
        dateCreation: Date;
    }>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=entreprise.d.ts.map