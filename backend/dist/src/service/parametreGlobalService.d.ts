export declare class ParametreGlobalService {
    createParametreGlobal(data: any): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }>;
    getAllParametresGlobaux(): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    getParametreGlobalById(id: number): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }>;
    getParametreGlobalByKey(cle: string): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }>;
    updateParametreGlobal(id: number, data: any): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }>;
    deleteParametreGlobal(id: number): Promise<void>;
    getParametresByCategory(categorie: string): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    getParametreValue(cle: string): Promise<string | null>;
}
//# sourceMappingURL=parametreGlobalService.d.ts.map