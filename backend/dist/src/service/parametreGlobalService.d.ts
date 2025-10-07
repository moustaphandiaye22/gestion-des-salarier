export declare class ParametreGlobalService {
    createParametreGlobal(data: any): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        dateModification: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
    }>;
    getAllParametresGlobaux(): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        dateModification: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
    }[]>;
    getParametreGlobalById(id: number): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        dateModification: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
    }>;
    getParametreGlobalByKey(cle: string): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        dateModification: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
    }>;
    updateParametreGlobal(id: number, data: any): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        dateModification: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
    }>;
    deleteParametreGlobal(id: number): Promise<void>;
    getParametresByCategory(categorie: string): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        dateModification: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
    }[]>;
    getParametreValue(cle: string): Promise<string | null>;
}
//# sourceMappingURL=parametreGlobalService.d.ts.map