import { AuthUtils } from '../auth/authUtils.js';
import { utilisateurValidator } from '../validators/utilisateur.js';
import { Logger } from '../utils/logger.js';
import { ValidationError, AuthenticationError, NotFoundError, InternalServerError } from '../errors/CustomError.js';
export class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(data) {
        try {
            Logger.info('Tentative d\'inscription d\'un utilisateur', { email: data.email });
            // Validation des données
            const parsed = utilisateurValidator.safeParse(data);
            if (!parsed.success) {
                Logger.warn('Échec de validation lors de l\'inscription', { errors: parsed.error.issues });
                throw new ValidationError('Données d\'inscription invalides', parsed.error.issues);
            }
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.userRepository.findByEmail(data.email);
            if (existingUser) {
                Logger.warn('Tentative d\'inscription avec un email déjà utilisé', { email: data.email });
                throw new ValidationError('Un utilisateur avec cet email existe déjà');
            }
            // Hash du mot de passe
            const hashedPassword = await AuthUtils.hashPassword(data.motDePasse);
            // Créer l'utilisateur
            const userData = {
                ...data,
                motDePasse: hashedPassword,
                role: data.role || 'USER',
                estActif: true
            };
            const utilisateur = await this.userRepository.create(userData);
            // Générer les tokens
            const tokens = this.generateTokens(utilisateur);
            Logger.info('Inscription réussie', { userId: utilisateur.id, email: utilisateur.email });
            return { utilisateur, ...tokens };
        }
        catch (error) {
            Logger.error('Erreur lors de l\'inscription', error, { email: data.email });
            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError('Impossible de créer le compte utilisateur');
        }
    }
    async login(data) {
        try {
            Logger.info('Tentative de connexion', { email: data.email });
            // Validation des données
            if (!data.email || !data.motDePasse) {
                throw new ValidationError('Email et mot de passe requis');
            }
            // Trouver l'utilisateur
            const utilisateur = await this.userRepository.findByEmail(data.email);
            if (!utilisateur) {
                Logger.warn('Tentative de connexion avec email inexistant', { email: data.email });
                throw new AuthenticationError('Email ou mot de passe incorrect');
            }
            // Vérifier si l'utilisateur est actif
            if (!utilisateur.estActif) {
                Logger.warn('Tentative de connexion avec compte inactif', { email: data.email });
                throw new AuthenticationError('Votre compte est désactivé. Contactez l\'administrateur.');
            }
            // Vérifier le mot de passe
            const isValidPassword = await AuthUtils.verifyPassword(data.motDePasse, utilisateur.motDePasse);
            if (!isValidPassword) {
                Logger.warn('Mot de passe incorrect', { email: data.email });
                throw new AuthenticationError('Email ou mot de passe incorrect');
            }
            // Générer les tokens
            const tokens = this.generateTokens(utilisateur);
            Logger.info('Connexion réussie', { userId: utilisateur.id, email: utilisateur.email });
            return { utilisateur, ...tokens };
        }
        catch (error) {
            Logger.error('Erreur lors de la connexion', error, { email: data.email });
            if (error instanceof ValidationError || error instanceof AuthenticationError) {
                throw error;
            }
            throw new InternalServerError('Impossible de se connecter');
        }
    }
    async refreshToken(refreshToken) {
        try {
            Logger.info('Tentative de rafraîchissement de token');
            if (!refreshToken) {
                throw new ValidationError('Refresh token requis');
            }
            // Vérifier et décoder le refresh token
            const decoded = AuthUtils.verifyRefreshToken(refreshToken);
            // Vérifier que l'utilisateur existe toujours
            const utilisateur = await this.userRepository.findByEmail(decoded.email);
            if (!utilisateur || !utilisateur.estActif) {
                Logger.warn('Tentative de rafraîchissement avec utilisateur invalide', { email: decoded.email });
                throw new AuthenticationError('Session expirée. Veuillez vous reconnecter.');
            }
            // Générer un nouveau token d'accès
            const newAccessToken = AuthUtils.generateAccessToken({
                email: utilisateur.email,
                profil: utilisateur.role
            });
            Logger.info('Token rafraîchi avec succès', { userId: utilisateur.id });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            Logger.error('Erreur lors du rafraîchissement du token', error);
            if (error instanceof ValidationError || error instanceof AuthenticationError) {
                throw error;
            }
            throw new AuthenticationError('Refresh token invalide ou expiré');
        }
    }
    async logout(refreshToken) {
        try {
            Logger.info('Déconnexion d\'un utilisateur');
            // Pour JWT stateless, la déconnexion se fait côté client
            // Dans le futur, on pourrait révoquer le refresh token si stocké en DB
            Logger.info('Déconnexion réussie');
            return { message: 'Déconnexion réussie' };
        }
        catch (error) {
            Logger.error('Erreur lors de la déconnexion', error);
            throw new InternalServerError('Impossible de se déconnecter');
        }
    }
    generateTokens(utilisateur) {
        const payload = {
            email: utilisateur.email,
            profil: utilisateur.role,
            ...(utilisateur.entrepriseId && { entrepriseId: utilisateur.entrepriseId })
        };
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }
}
// Factory function pour créer le service avec les dépendances
export const createAuthService = (userRepository) => {
    return new AuthService(userRepository);
};
//# sourceMappingURL=authService.js.map