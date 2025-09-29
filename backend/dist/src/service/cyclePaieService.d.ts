export declare class CyclePaieService {
    private cyclePaieRepository;
    constructor();
    createCyclePaie(data: any): Promise<{
        id: number;
        entrepriseId: number;
        dateCreation: Date;
        periodeDebut: Date;
        periodeFin: Date;
        typeCycle: import("@prisma/client").$Enums.TypeCyclePaie;
        estFerme: boolean;
    }>;
    getCyclePaie(id: number): Promise<{
        id: number;
        entrepriseId: number;
        dateCreation: Date;
        periodeDebut: Date;
        periodeFin: Date;
        typeCycle: import("@prisma/client").$Enums.TypeCyclePaie;
        estFerme: boolean;
    } | null>;
    getAllCyclesPaie(): Promise<{
        id: number;
        entrepriseId: number;
        dateCreation: Date;
        periodeDebut: Date;
        periodeFin: Date;
        typeCycle: import("@prisma/client").$Enums.TypeCyclePaie;
        estFerme: boolean;
    }[]>;
    updateCyclePaie(id: number, data: any): Promise<{
        id: number;
        entrepriseId: number;
        dateCreation: Date;
        periodeDebut: Date;
        periodeFin: Date;
        typeCycle: import("@prisma/client").$Enums.TypeCyclePaie;
        estFerme: boolean;
    }>;
    deleteCyclePaie(id: number): Promise<void>;
    setEstFerme(id: number, estFerme: boolean): Promise<{
        id: number;
        entrepriseId: number;
        dateCreation: Date;
        periodeDebut: Date;
        periodeFin: Date;
        typeCycle: import("@prisma/client").$Enums.TypeCyclePaie;
        estFerme: boolean;
    }>;
}
//# sourceMappingURL=cyclePaieService.d.ts.map