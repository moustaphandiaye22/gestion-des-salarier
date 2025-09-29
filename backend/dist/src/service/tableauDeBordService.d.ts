export declare class TableauDeBordService {
    private tableauDeBordRepository;
    createTableauDeBord(data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        configuration: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getTableauDeBord(id: number): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        configuration: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getAllTableauxDeBord(): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        configuration: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    updateTableauDeBord(id: number, data: any): Promise<{
        id: number;
        nom: string;
        entrepriseId: number;
        configuration: import("@prisma/client/runtime/library").JsonValue;
    }>;
    deleteTableauDeBord(id: number): Promise<{
        message: string;
    }>;
}
export declare const tableauDeBordService: TableauDeBordService;
//# sourceMappingURL=tableauDeBordService.d.ts.map