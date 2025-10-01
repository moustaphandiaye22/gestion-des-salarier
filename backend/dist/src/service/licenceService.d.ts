import { StatutLicence, TypeLicence } from '@prisma/client';
export declare class LicenceService {
    createLicence(data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getAllLicences(): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getLicenceById(id: number): Promise<{
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getLicenceByNom(nom: string): Promise<{
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    updateLicence(id: number, data: any): Promise<{
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    deleteLicence(id: number): Promise<{
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getLicencesByEntreprise(entrepriseId: number): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getLicencesByStatut(statut: StatutLicence): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getLicencesByType(typeLicence: TypeLicence): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    assignLicenceToEntreprise(licenceId: number, entrepriseId: number): Promise<{
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    revokeLicenceFromEntreprise(licenceId: number): Promise<{
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            telephone: string | null;
            adresse: string | null;
            description: string | null;
            logo: string | null;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        dateDebut: Date;
        dateFin: Date | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
//# sourceMappingURL=licenceService.d.ts.map