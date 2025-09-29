export declare class UtilisateurService {
    private utilisateurRepository;
    createUtilisateur(data: any): Promise<{
        id: number;
        nom: string;
        email: string;
        motDePasse: string;
        role: import("@prisma/client").$Enums.RoleUtilisateur;
        estActif: boolean;
        entrepriseId: number | null;
    }>;
    getUtilisateur(id: number): Promise<{
        id: number;
        nom: string;
        email: string;
        motDePasse: string;
        role: import("@prisma/client").$Enums.RoleUtilisateur;
        estActif: boolean;
        entrepriseId: number | null;
    } | null>;
    getAllUtilisateurs(): Promise<{
        id: number;
        nom: string;
        email: string;
        motDePasse: string;
        role: import("@prisma/client").$Enums.RoleUtilisateur;
        estActif: boolean;
        entrepriseId: number | null;
    }[]>;
    updateUtilisateur(id: number, data: any): Promise<{
        id: number;
        nom: string;
        email: string;
        motDePasse: string;
        role: import("@prisma/client").$Enums.RoleUtilisateur;
        estActif: boolean;
        entrepriseId: number | null;
    }>;
    deleteUtilisateur(id: number): Promise<void>;
}
export declare const utilisateurService: UtilisateurService;
//# sourceMappingURL=utilisateurService.d.ts.map