import type { ParametreGlobal } from '@prisma/client';
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class ParametreGlobalRepository implements InterfaceRepository<ParametreGlobal> {
    findAll(): Promise<ParametreGlobal[]>;
    findById(id: number): Promise<ParametreGlobal | null>;
    create(data: any): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }>;
    getAll(): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    getById(id: number): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    } | null>;
    getByKey(cle: string): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    } | null>;
    update(id: number, data: any): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }>;
    delete(id: number): Promise<void>;
    getByCategory(categorie: string): Promise<{
        id: number;
        cle: string;
        valeur: string;
        description: string | null;
        categorie: string | null;
        estModifiable: boolean;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
}
//# sourceMappingURL=parametreGlobal.d.ts.map