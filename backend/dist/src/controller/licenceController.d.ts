import type { Request, Response } from 'express';
export declare class LicenceController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    getByNom(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getByEntreprise(req: Request, res: Response): Promise<void>;
    getByStatut(req: Request, res: Response): Promise<void>;
    getByType(req: Request, res: Response): Promise<void>;
    assignToEntreprise(req: Request, res: Response): Promise<void>;
    revokeFromEntreprise(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=licenceController.d.ts.map