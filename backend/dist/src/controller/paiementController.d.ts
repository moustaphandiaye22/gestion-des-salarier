import type { Request, Response } from 'express';
export declare class PaiementController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    generateReceiptPDF(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    generatePaymentListPDF(req: Request, res: Response): Promise<void>;
    exportToExcel(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=paiementController.d.ts.map