import { StatutCyclePaie } from '@prisma/client';
export declare class CyclePaieService {
    private cyclePaieRepository;
    constructor();
    createCyclePaie(data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        dateDebut: Date;
        dateFin: Date;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCyclePaie(id: number): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        dateDebut: Date;
        dateFin: Date;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAllCyclesPaie(user?: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        dateDebut: Date;
        dateFin: Date;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateCyclePaie(id: number, data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        dateDebut: Date;
        dateFin: Date;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCyclePaie(id: number): Promise<void>;
    setStatut(id: number, statut: StatutCyclePaie): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        dateDebut: Date;
        dateFin: Date;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=cyclePaieService.d.ts.map