import { StatutCyclePaie } from '@prisma/client';
export declare class CyclePaieService {
    private cyclePaieRepository;
    private bulletinService;
    private salaryCalculationService;
    constructor();
    createCyclePaie(data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        dateDebut: Date;
        dateFin: Date;
        statutValidation: import("@prisma/client").$Enums.StatutValidationCycle;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCyclePaie(id: number): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        dateDebut: Date;
        dateFin: Date;
        statutValidation: import("@prisma/client").$Enums.StatutValidationCycle;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAllCyclesPaie(user?: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        dateDebut: Date;
        dateFin: Date;
        statutValidation: import("@prisma/client").$Enums.StatutValidationCycle;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateCyclePaie(id: number, data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        dateDebut: Date;
        dateFin: Date;
        statutValidation: import("@prisma/client").$Enums.StatutValidationCycle;
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
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        dateDebut: Date;
        dateFin: Date;
        statutValidation: import("@prisma/client").$Enums.StatutValidationCycle;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validateCyclePaie(id: number, user: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        dateDebut: Date;
        dateFin: Date;
        statutValidation: import("@prisma/client").$Enums.StatutValidationCycle;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }>;
    closeCyclePaie(id: number, user: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        description: string | null;
        statut: import("@prisma/client").$Enums.StatutCyclePaie;
        dateDebut: Date;
        dateFin: Date;
        statutValidation: import("@prisma/client").$Enums.StatutValidationCycle;
        frequence: import("@prisma/client").$Enums.FrequencePaie;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateBulletinsForCycle(cycleId: number): Promise<void>;
    canCashierPayCycle(id: number, user: any): Promise<boolean>;
}
//# sourceMappingURL=cyclePaieService.d.ts.map