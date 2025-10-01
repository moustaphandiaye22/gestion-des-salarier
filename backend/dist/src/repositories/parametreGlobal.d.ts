import type { ParametreGlobal } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class ParametreGlobalRepository implements InterfaceRepository<ParametreGlobal> {
    findAll(): Promise<ParametreGlobal[]>;
    findById(id: number): Promise<ParametreGlobal | null>;
    create(data: any): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }>;
    getAll(): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }[]>;
    getById(id: number): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    } | null>;
    getByKey(cle: string): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    } | null>;
    update(id: number, data: any): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }>;
    delete(id: number): Promise<void>;
    getByCategory(categorie: string): Promise<{
        id: number;
        description: string | null;
        dateCreation: Date;
        categorie: string | null;
        cle: string;
        valeur: string;
        estModifiable: boolean;
        dateModification: Date;
    }[]>;
}
//# sourceMappingURL=parametreGlobal.d.ts.map