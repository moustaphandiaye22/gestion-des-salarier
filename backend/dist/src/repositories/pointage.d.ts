import type { Pointage, TypePointage, StatutPointage } from "@prisma/client";
import type { InterfaceRepository } from './InterfaceRepository.js';
export declare class pointageRepository implements InterfaceRepository<Pointage> {
    findByEmployeAndDate(employeId: number, datePointage: Date): Promise<Pointage[]>;
    findByEntrepriseAndDate(entrepriseId: number, dateDebut: Date, dateFin: Date): Promise<Pointage[]>;
    findByType(typePointage: TypePointage): Promise<Pointage[]>;
    findByStatut(statut: StatutPointage): Promise<Pointage[]>;
    findByEmployeAndPeriode(employeId: number, dateDebut: Date, dateFin: Date): Promise<Pointage[]>;
    calculateHeuresTravaillees(employeId: number, dateDebut: Date, dateFin: Date): Promise<number>;
    create(data: any): Promise<any>;
    findById(id: number): Promise<any>;
    findAll(): Promise<any[]>;
    findAllByUser(user: any, entrepriseId?: number): Promise<any[]>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<void>;
    bulkCreate(pointages: any[]): Promise<any[]>;
    getStatistiques(entrepriseId: number, dateDebut: Date, dateFin: Date): Promise<{
        total: number;
        presents: number;
        absents: number;
        heuresTotales: number;
    }>;
}
//# sourceMappingURL=pointage.d.ts.map