import type { Request, Response, NextFunction } from 'express';
import type { IAuthService } from '../interfaces/IAuthService.js';
export declare class AuthController {
    private authService;
    constructor(authService: IAuthService);
    register: (req: Request, res: Response, next: NextFunction) => void;
    login: (req: Request, res: Response, next: NextFunction) => void;
    refreshToken: (req: Request, res: Response, next: NextFunction) => void;
    logout: (req: Request, res: Response, next: NextFunction) => void;
    getCurrentUser: (req: Request, res: Response, next: NextFunction) => void;
    updateProfile: (req: Request, res: Response, next: NextFunction) => void;
    changePassword: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const createAuthController: (authService: IAuthService) => AuthController;
//# sourceMappingURL=authController.d.ts.map