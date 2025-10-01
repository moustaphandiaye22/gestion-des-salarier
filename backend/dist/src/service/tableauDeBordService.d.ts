export declare class TableauDeBordService {
    private tableauDeBordRepository;
    createTableauDeBord(data: any): Promise<{
        id: number;
        nom: string;
        estActif: boolean;
        entrepriseId: number;
        dateCreation: Date;
        dateModification: Date;
        configuration: import("@prisma/client/runtime/library").JsonValue;
        roleRequis: import("@prisma/client").$Enums.RoleUtilisateur;
    }>;
    getTableauDeBord(id: number): Promise<{
        id: number;
        nom: string;
        estActif: boolean;
        entrepriseId: number;
        dateCreation: Date;
        dateModification: Date;
        configuration: import("@prisma/client/runtime/library").JsonValue;
        roleRequis: import("@prisma/client").$Enums.RoleUtilisateur;
    }>;
    getAllTableauxDeBord(): Promise<{
        id: number;
        nom: string;
        estActif: boolean;
        entrepriseId: number;
        dateCreation: Date;
        dateModification: Date;
        configuration: import("@prisma/client/runtime/library").JsonValue;
        roleRequis: import("@prisma/client").$Enums.RoleUtilisateur;
    }[]>;
    updateTableauDeBord(id: number, data: any): Promise<{
        id: number;
        nom: string;
        estActif: boolean;
        entrepriseId: number;
        dateCreation: Date;
        dateModification: Date;
        configuration: import("@prisma/client/runtime/library").JsonValue;
        roleRequis: import("@prisma/client").$Enums.RoleUtilisateur;
    }>;
    deleteTableauDeBord(id: number): Promise<{
        message: string;
    }>;
}
export declare const tableauDeBordService: TableauDeBordService;
//# sourceMappingURL=tableauDeBordService.d.ts.map