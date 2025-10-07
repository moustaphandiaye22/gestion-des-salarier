import { StatutLicence, TypeLicence } from '@prisma/client';
export declare class LicenceRepository {
    create(data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getAll(): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            description: string | null;
            adresse: string | null;
            telephone: string | null;
            siteWeb: string | null;
            secteurActivite: string | null;
            logo: string | null;
            couleurPrimaire: string | null;
            couleurSecondaire: string | null;
            superAdminAccessGranted: boolean;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getById(id: number): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            description: string | null;
            adresse: string | null;
            telephone: string | null;
            siteWeb: string | null;
            secteurActivite: string | null;
            logo: string | null;
            couleurPrimaire: string | null;
            couleurSecondaire: string | null;
            superAdminAccessGranted: boolean;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }) | null>;
    getByNom(nom: string): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            description: string | null;
            adresse: string | null;
            telephone: string | null;
            siteWeb: string | null;
            secteurActivite: string | null;
            logo: string | null;
            couleurPrimaire: string | null;
            couleurSecondaire: string | null;
            superAdminAccessGranted: boolean;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }) | null>;
    update(id: number, data: any): Promise<{
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            description: string | null;
            adresse: string | null;
            telephone: string | null;
            siteWeb: string | null;
            secteurActivite: string | null;
            logo: string | null;
            couleurPrimaire: string | null;
            couleurSecondaire: string | null;
            superAdminAccessGranted: boolean;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getByEntreprise(entrepriseId: number): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            description: string | null;
            adresse: string | null;
            telephone: string | null;
            siteWeb: string | null;
            secteurActivite: string | null;
            logo: string | null;
            couleurPrimaire: string | null;
            couleurSecondaire: string | null;
            superAdminAccessGranted: boolean;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getByStatut(statut: StatutLicence): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            description: string | null;
            adresse: string | null;
            telephone: string | null;
            siteWeb: string | null;
            secteurActivite: string | null;
            logo: string | null;
            couleurPrimaire: string | null;
            couleurSecondaire: string | null;
            superAdminAccessGranted: boolean;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getByType(typeLicence: TypeLicence): Promise<({
        entreprise: {
            id: number;
            nom: string;
            email: string | null;
            description: string | null;
            adresse: string | null;
            telephone: string | null;
            siteWeb: string | null;
            secteurActivite: string | null;
            logo: string | null;
            couleurPrimaire: string | null;
            couleurSecondaire: string | null;
            superAdminAccessGranted: boolean;
            estActive: boolean;
            dateCreation: Date;
        } | null;
    } & {
        id: number;
        nom: string;
        entrepriseId: number | null;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutLicence;
        dateDebut: Date;
        dateFin: Date | null;
        typeLicence: import("@prisma/client").$Enums.TypeLicence;
        limiteUtilisateurs: number | null;
        limiteEntreprises: number | null;
        prix: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
}
//# sourceMappingURL=licence.d.ts.map