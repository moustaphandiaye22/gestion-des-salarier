import type { Request, Response } from 'express';
export declare class QrCodeController {
    generateEmployeeQr(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    generateMultipleQrCodes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    regenerateEmployeeQr(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    scanQrCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    pointerParQrCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getQrCodeInfo(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=qrCodeController.d.ts.map