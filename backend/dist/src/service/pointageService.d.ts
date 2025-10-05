export declare class PointageService {
    private pointageRepository;
    private employeService;
    constructor();
    createPointage(data: any): Promise<any>;
    getPointage(id: number): Promise<any>;
    getAllPointages(user?: any, entrepriseId?: number): Promise<any[]>;
    updatePointage(id: number, data: any): Promise<any>;
    deletePointage(id: number): Promise<void>;
    getPointagesByEmploye(employeId: number): Promise<{
        id: number;
        entrepriseId: number;
        datePointage: Date;
        heureEntree: Date | null;
        heureSortie: Date | null;
        dureeTravail: import("@prisma/client/runtime/library").Decimal | null;
        typePointage: import("@prisma/client").$Enums.TypePointage;
        statut: import("@prisma/client").$Enums.StatutPointage;
        lieu: string | null;
        commentaire: string | null;
        ipAddress: string | null;
        localisation: import("@prisma/client/runtime/library").JsonValue | null;
        employeId: number;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    getPointagesByEmployeAndPeriode(employeId: number, dateDebut: Date, dateFin: Date): Promise<{
        id: number;
        entrepriseId: number;
        datePointage: Date;
        heureEntree: Date | null;
        heureSortie: Date | null;
        dureeTravail: import("@prisma/client/runtime/library").Decimal | null;
        typePointage: import("@prisma/client").$Enums.TypePointage;
        statut: import("@prisma/client").$Enums.StatutPointage;
        lieu: string | null;
        commentaire: string | null;
        ipAddress: string | null;
        localisation: import("@prisma/client/runtime/library").JsonValue | null;
        employeId: number;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    getPointagesByEntrepriseAndDate(entrepriseId: number, dateDebut: Date, dateFin: Date): Promise<{
        id: number;
        entrepriseId: number;
        datePointage: Date;
        heureEntree: Date | null;
        heureSortie: Date | null;
        dureeTravail: import("@prisma/client/runtime/library").Decimal | null;
        typePointage: import("@prisma/client").$Enums.TypePointage;
        statut: import("@prisma/client").$Enums.StatutPointage;
        lieu: string | null;
        commentaire: string | null;
        ipAddress: string | null;
        localisation: import("@prisma/client/runtime/library").JsonValue | null;
        employeId: number;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    getPointagesByType(typePointage: string): Promise<{
        id: number;
        entrepriseId: number;
        datePointage: Date;
        heureEntree: Date | null;
        heureSortie: Date | null;
        dureeTravail: import("@prisma/client/runtime/library").Decimal | null;
        typePointage: import("@prisma/client").$Enums.TypePointage;
        statut: import("@prisma/client").$Enums.StatutPointage;
        lieu: string | null;
        commentaire: string | null;
        ipAddress: string | null;
        localisation: import("@prisma/client/runtime/library").JsonValue | null;
        employeId: number;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    getPointagesByStatut(statut: string): Promise<{
        id: number;
        entrepriseId: number;
        datePointage: Date;
        heureEntree: Date | null;
        heureSortie: Date | null;
        dureeTravail: import("@prisma/client/runtime/library").Decimal | null;
        typePointage: import("@prisma/client").$Enums.TypePointage;
        statut: import("@prisma/client").$Enums.StatutPointage;
        lieu: string | null;
        commentaire: string | null;
        ipAddress: string | null;
        localisation: import("@prisma/client/runtime/library").JsonValue | null;
        employeId: number;
        dateCreation: Date;
        dateModification: Date;
    }[]>;
    calculateHeuresTravaillees(employeId: number, dateDebut: Date, dateFin: Date): Promise<number>;
    bulkCreatePointages(pointages: any[]): Promise<{
        success: any[];
        errors: {
            index: number;
            errors: any[];
        }[];
    }>;
    getStatistiques(entrepriseId: number, dateDebut: Date, dateFin: Date): Promise<{
        total: number;
        presents: number;
        absents: number;
        heuresTotales: number;
    }>;
    pointerEntree(employeId: number, entrepriseId: number, lieu?: string, ipAddress?: string, localisation?: any): Promise<any>;
    pointerSortie(employeId: number, entrepriseId: number, lieu?: string, ipAddress?: string, localisation?: any): Promise<any>;
    private calculateDureeTravail;
    filterPointages(filters: any): Promise<any[]>;
}
//# sourceMappingURL=pointageService.d.ts.map