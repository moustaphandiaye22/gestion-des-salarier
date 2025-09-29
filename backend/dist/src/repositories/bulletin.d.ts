import { Prisma } from '@prisma/client';
import type { Bulletin, StatutPaiement } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class bulletinRepository implements InterfaceRepository<Bulletin> {
    findByEmploye(employeId: number): Promise<Bulletin[]>;
    findByCycle(cycleId: number): Promise<Bulletin[]>;
    setStatutPaiement(id: number, statutPaiement: StatutPaiement): Promise<Bulletin>;
    create(data: Omit<Bulletin, "id">): Promise<Bulletin>;
    findById(id: number): Promise<Bulletin | null>;
    findAll(): Promise<Bulletin[]>;
    update(id: number, data: Partial<Omit<Bulletin, "id">>): Promise<{
        id: number;
        employeId: number;
        salaireBase: Prisma.Decimal;
        allocations: Prisma.Decimal;
        deductions: Prisma.Decimal;
        numeroBulletin: string;
        periodeDebut: Date;
        periodeFin: Date;
        totalAPayer: Prisma.Decimal;
        statutPaiement: import("@prisma/client").$Enums.StatutPaiement;
        dateGeneration: Date;
        cycleId: number;
    }>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=bulletin.d.ts.map