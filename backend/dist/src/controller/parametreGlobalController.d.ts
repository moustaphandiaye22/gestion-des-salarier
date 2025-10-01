import type { Request, Response } from 'express';
export declare class ParametreGlobalController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    getByKey(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getByCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getValue(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=parametreGlobalController.d.ts.map