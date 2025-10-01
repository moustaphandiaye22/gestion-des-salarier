export declare class ProfessionService {
    getAll(): Promise<{
        id: number;
        nom: string;
        description: string | null;
        categorie: string | null;
        estActive: boolean;
    }[]>;
    getById(id: number): Promise<{
        id: number;
        nom: string;
        description: string | null;
        categorie: string | null;
        estActive: boolean;
    }>;
    create(data: {
        nom: string;
        description?: string;
        categorie?: string;
    }): Promise<{
        id: number;
        nom: string;
        description: string | null;
        categorie: string | null;
        estActive: boolean;
    }>;
    update(id: number, data: {
        nom?: string;
        description?: string;
        categorie?: string;
        estActive?: boolean;
    }): Promise<{
        id: number;
        nom: string;
        description: string | null;
        categorie: string | null;
        estActive: boolean;
    }>;
    delete(id: number): Promise<{
        id: number;
        nom: string;
        description: string | null;
        categorie: string | null;
        estActive: boolean;
    }>;
}
//# sourceMappingURL=professionService.d.ts.map