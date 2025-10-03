import type { Request, Response } from 'express';
export declare class EmployeController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getLatestBulletin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    bulkImport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    exportTemplate(req: Request, res: Response): Promise<void>;
    generateQrCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    regenerateQrCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getEmployeStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updatePresenceStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    generateAllQrCodes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getQrCodeImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=employeController.d.ts.map