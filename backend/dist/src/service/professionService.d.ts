export declare class ProfessionService {
    getAll(): Promise<{
        id: number;
        nom: string;
        description: string | null;
        estActive: boolean;
        categorie: string | null;
    }[]>;
    getById(id: number): Promise<{
        id: number;
        nom: string;
        description: string | null;
        estActive: boolean;
        categorie: string | null;
    }>;
    create(data: {
        nom: string;
        description?: string;
        categorie?: string;
    }): Promise<{
        id: number;
        nom: string;
        description: string | null;
        estActive: boolean;
        categorie: string | null;
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
        estActive: boolean;
        categorie: string | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        nom: string;
        description: string | null;
        estActive: boolean;
        categorie: string | null;
    }>;
}
//# sourceMappingURL=professionService.d.ts.map