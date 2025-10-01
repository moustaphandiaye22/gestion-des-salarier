export declare class ParametreEntrepriseService {
    private parametreEntrepriseRepository;
    createParametreEntreprise(data: any): Promise<{
        id: number;
        entrepriseId: number;
        cle: string;
        valeur: string;
    }>;
    getParametreEntreprise(id: number): Promise<{
        id: number;
        entrepriseId: number;
        cle: string;
        valeur: string;
    }>;
    getAllParametresEntreprise(user?: any): Promise<{
        id: number;
        entrepriseId: number;
        cle: string;
        valeur: string;
    }[]>;
    updateParametreEntreprise(id: number, data: any): Promise<{
        id: number;
        entrepriseId: number;
        cle: string;
        valeur: string;
    }>;
    deleteParametreEntreprise(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=parametreEntrepriseService.d.ts.map