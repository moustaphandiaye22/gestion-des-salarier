export declare class EntrepriseService {
    private entrepriseRepository;
    private utilisateurService;
    constructor();
    createEntreprise(data: any): Promise<{
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
        };
        adminUtilisateur: {
            id: number;
            nom: string;
            email: string;
            motDePasse: string;
            role: import("@prisma/client").$Enums.RoleUtilisateur;
            estActif: boolean;
            entrepriseId: number | null;
        } | null;
    }>;
    getEntreprise(id: number): Promise<{
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
    } | null>;
    getAllEntreprises(user?: any): Promise<{
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
    }[]>;
    updateEntreprise(id: number, data: any): Promise<{
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
    }>;
    deleteEntreprise(id: number): Promise<void>;
}
export declare const entrepriseService: EntrepriseService;
//# sourceMappingURL=entrepriseService.d.ts.map