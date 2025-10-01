import type { Request, Response } from 'express';
export declare class EmployeController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getLatestBulletin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    bulkImport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=employeController.d.ts.map