import { asyncHandler } from '../middleware/errorMiddleware.js';
import { Logger } from '../utils/logger.js';
export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = asyncHandler(async (req, res) => {
        Logger.info('Requête d\'inscription reçue', { email: req.body.email });
        const result = await this.authService.register(req.body);
        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            utilisateur: result.utilisateur,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        });
    });
    login = asyncHandler(async (req, res) => {
        const { email, motDePasse } = req.body;
        Logger.info('Requête de connexion reçue', { email });
        const result = await this.authService.login({ email, motDePasse });
        res.json({
            message: 'Connexion réussie.',
            utilisateur: result.utilisateur,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        });
    });
    refreshToken = asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        Logger.info('Requête de rafraîchissement de token reçue');
        const result = await this.authService.refreshToken(refreshToken);
        res.json({
            message: 'Token rafraîchi avec succès.',
            accessToken: result.accessToken
        });
    });
    logout = asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        Logger.info('Requête de déconnexion reçue');
        const result = await this.authService.logout(refreshToken || '');
        res.json(result);
    });
    getCurrentUser = asyncHandler(async (req, res) => {
        Logger.info('Requête de récupération de l\'utilisateur actuel reçue');
        // L'utilisateur est déjà attaché par le middleware d'authentification
        const utilisateur = req.user;
        if (!utilisateur) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }
        res.json({
            message: 'Utilisateur récupéré avec succès.',
            utilisateur
        });
    });
}
// Factory function pour créer le controller avec les dépendances
export const createAuthController = (authService) => {
    return new AuthController(authService);
};
//# sourceMappingURL=authController.js.map