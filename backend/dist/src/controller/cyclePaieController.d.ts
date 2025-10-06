import type { Request, Response } from 'express';
export declare class CyclePaieController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<void>;
    validate(req: Request, res: Response): Promise<void>;
    close(req: Request, res: Response): Promise<void>;
    canCashierPay(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=cyclePaieController.d.ts.map