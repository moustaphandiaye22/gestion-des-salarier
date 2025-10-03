import type { Request, Response } from 'express';
export declare class PointageController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getByEmploye(req: Request, res: Response): Promise<void>;
    getByEmployeAndPeriode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByEntrepriseAndDate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByType(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByStatut(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    pointerEntree(req: Request, res: Response): Promise<void>;
    pointerSortie(req: Request, res: Response): Promise<void>;
    calculateHeuresTravaillees(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getStatistiques(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    filter(req: Request, res: Response): Promise<void>;
    bulkCreate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=pointageController.d.ts.map