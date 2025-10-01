import type { Request, Response, NextFunction } from 'express';
import type { IUtilisateurService } from '../service/utilisateurService.js';
export declare class UtilisateurController {
    private utilisateurService;
    constructor(utilisateurService: IUtilisateurService);
    create: (req: Request, res: Response, next: NextFunction) => void;
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const createUtilisateurController: (utilisateurService: IUtilisateurService) => UtilisateurController;
//# sourceMappingURL=utilisateurController.d.ts.map