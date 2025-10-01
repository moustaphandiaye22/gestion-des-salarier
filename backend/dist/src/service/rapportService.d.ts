export declare class RapportService {
    private rapportRepository;
    createRapport(data: any): Promise<{
        id: number;
        entrepriseId: number;
        dateGeneration: Date;
        typeRapport: import("@prisma/client").$Enums.TypeRapport;
        contenu: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getRapport(id: number): Promise<{
        id: number;
        entrepriseId: number;
        dateGeneration: Date;
        typeRapport: import("@prisma/client").$Enums.TypeRapport;
        contenu: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getAllRapports(user?: any): Promise<{
        id: number;
        entrepriseId: number;
        dateGeneration: Date;
        typeRapport: import("@prisma/client").$Enums.TypeRapport;
        contenu: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    updateRapport(id: number, data: any): Promise<{
        id: number;
        entrepriseId: number;
        dateGeneration: Date;
        typeRapport: import("@prisma/client").$Enums.TypeRapport;
        contenu: import("@prisma/client/runtime/library").JsonValue;
    }>;
    deleteRapport(id: number): Promise<{
        message: string;
    }>;
}
export declare const rapportService: RapportService;
//# sourceMappingURL=rapportService.d.ts.map