import type { ParametreGlobal } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class ParametreGlobalRepository implements InterfaceRepository<ParametreGlobal> {
    findAll(): Promise<ParametreGlobal[]>;
    findById(id: number): Promise<ParametreGlobal | null>;
    create(data: any): Promise<{
        id: number;
        dateCreation: Date;
        dateModification: Date;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
    }>;
    getAll(): Promise<{
        id: number;
        dateCreation: Date;
        dateModification: Date;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
    }[]>;
    getById(id: number): Promise<{
        id: number;
        dateCreation: Date;
        dateModification: Date;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
    } | null>;
    getByKey(cle: string): Promise<{
        id: number;
        dateCreation: Date;
        dateModification: Date;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
    } | null>;
    update(id: number, data: any): Promise<{
        id: number;
        dateCreation: Date;
        dateModification: Date;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
    }>;
    delete(id: number): Promise<void>;
    getByCategory(categorie: string): Promise<{
        id: number;
        dateCreation: Date;
        dateModification: Date;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
    }[]>;
}
//# sourceMappingURL=parametreGlobal.d.ts.map