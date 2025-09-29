import { utilisateurRepository } from '../repositories/utilisateur.js';
import { AuthRepository } from '../repositories/authRepository.js';
import { AuthUtils } from '../auth/authUtils.js';
import { utilisateurValidator } from '../validators/utilisateur.js';
export class AuthService {
    utilisateurRepository = new utilisateurRepository();
    authRepository = new AuthRepository();
    async register(data) {
        const parsed = utilisateurValidator.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        // Hash password
        if (data.motDePasse) {
            data.motDePasse = await AuthUtils.hashPassword(data.motDePasse);
        }
        const utilisateur = await this.utilisateurRepository.create(data);
        // Generate tokens
        const accessToken = AuthUtils.generateAccessToken({
            email: utilisateur.email,
            profil: utilisateur.role
        });
        const refreshToken = AuthUtils.generateRefreshToken({
            email: utilisateur.email,
            profil: utilisateur.role
        });
        return { utilisateur, accessToken, refreshToken };
    }
    async login(email, motDePasse) {
        const utilisateur = await this.utilisateurRepository.findByEmail(email);
        if (!utilisateur) {
            throw new Error('Utilisateur non trouvé');
        }
        const isValidPassword = await AuthUtils.verifyPassword(motDePasse, utilisateur.motDePasse);
        if (!isValidPassword) {
            throw new Error('Mot de passe incorrect');
        }
        // Generate tokens
        const accessToken = AuthUtils.generateAccessToken({
            email: utilisateur.email,
            profil: utilisateur.role
        });
        const refreshToken = AuthUtils.generateRefreshToken({
            email: utilisateur.email,
            profil: utilisateur.role
        });
        return { utilisateur, accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = AuthUtils.verifyRefreshToken(refreshToken);
            const newAccessToken = AuthUtils.generateAccessToken({
                email: decoded.email,
                profil: decoded.profil || 'USER'
            });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new Error('Refresh token invalide');
        }
    }
    async logout(refreshToken) {
        // For stateless JWT, client-side handling
        // Future: revoke refresh token if stored
        return { message: 'Déconnexion réussie' };
    }
}
export const authService = new AuthService();
//# sourceMappingURL=authService.js.map