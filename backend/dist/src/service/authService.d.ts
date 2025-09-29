export declare class AuthService {
    private utilisateurRepository;
    private authRepository;
    register(data: any): Promise<{
        utilisateur: {
            id: number;
            nom: string;
            email: string;
            motDePasse: string;
            role: import("@prisma/client").$Enums.RoleUtilisateur;
            estActif: boolean;
            entrepriseId: number | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, motDePasse: string): Promise<{
        utilisateur: {
            id: number;
            nom: string;
            email: string;
            motDePasse: string;
            role: import("@prisma/client").$Enums.RoleUtilisateur;
            estActif: boolean;
            entrepriseId: number | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map