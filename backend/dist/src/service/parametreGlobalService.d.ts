export declare class ParametreGlobalService {
    createParametreGlobal(data: any): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }>;
    getAllParametresGlobaux(): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }[]>;
    getParametreGlobalById(id: number): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }>;
    getParametreGlobalByKey(cle: string): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }>;
    updateParametreGlobal(id: number, data: any): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }>;
    deleteParametreGlobal(id: number): Promise<void>;
    getParametresByCategory(categorie: string): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }[]>;
    getParametreValue(cle: string): Promise<string | null>;
}
//# sourceMappingURL=parametreGlobalService.d.ts.map