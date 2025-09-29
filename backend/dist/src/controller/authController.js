import { authService } from '../service/authService.js';
import { AuthUtils } from '../auth/authUtils.js';
export class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                message: 'Utilisateur créé avec succès.',
                utilisateur: result.utilisateur,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création de l'utilisateur : ${err.message}` });
            }
        }
    }
    async login(req, res) {
        try {
            const { email, motDePasse } = req.body;
            const result = await authService.login(email, motDePasse);
            res.json({
                message: 'Connexion réussie.',
                utilisateur: result.utilisateur,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            });
        }
        catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ error: 'Refresh token requis' });
            }
            const result = await authService.refreshToken(refreshToken);
            res.json({ accessToken: result.accessToken });
        }
        catch (err) {
            res.status(403).json({ error: 'Refresh token invalide' });
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            await authService.logout(refreshToken || '');
            res.json({ message: 'Déconnexion réussie.' });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
//# sourceMappingURL=authController.js.map