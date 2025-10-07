import { AuthUtils } from '../auth/authUtils.js';
import { utilisateurValidator } from '../validators/utilisateur.js';
import { Logger } from '../utils/logger.js';
import { ValidationError, AuthenticationError, NotFoundError, InternalServerError } from '../errors/CustomError.js';
import { employeRepository } from '../repositories/employe.js';
export class AuthService {
    userRepository;
    employeRepo;
    constructor(userRepository, employeRepo) {
        this.userRepository = userRepository;
        this.employeRepo = employeRepo;
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
            let user = null;
            let isEmployee = false;
            // D'abord, chercher dans la table Utilisateur
            user = await this.userRepository.findByEmail(data.email);
            if (!user) {
                // Si pas trouvé dans Utilisateur, chercher dans Employe
                user = await this.employeRepo.findByEmail(data.email);
                if (user) {
                    isEmployee = true;
                }
            }
            if (!user) {
                Logger.warn('Tentative de connexion avec email inexistant', { email: data.email });
                throw new AuthenticationError('Email ou mot de passe incorrect');
            }
            // Vérifier si l'utilisateur/employé est actif
            if (!user.estActif) {
                Logger.warn('Tentative de connexion avec compte inactif', { email: data.email });
                throw new AuthenticationError('Votre compte est désactivé. Contactez l\'administrateur.');
            }
            // Vérifier le mot de passe
            const isValidPassword = await AuthUtils.verifyPassword(data.motDePasse, user.motDePasse);
            if (!isValidPassword) {
                Logger.warn('Mot de passe incorrect', { email: data.email });
                throw new AuthenticationError('Email ou mot de passe incorrect');
            }
            // Générer les tokens
            const tokens = this.generateTokensForUser(user, isEmployee);
            Logger.info('Connexion réussie', { userId: user.id, email: user.email, isEmployee });
            return { utilisateur: user, ...tokens };
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
                profil: utilisateur.role,
                ...(utilisateur.entrepriseId && { entrepriseId: utilisateur.entrepriseId })
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
    async updateProfile(userId, profileData) {
        try {
            Logger.info("Tentative de mise à jour du profil", { userId });
            const userIdNum = parseInt(userId, 10);
            if (isNaN(userIdNum)) {
                throw new ValidationError("ID utilisateur invalide");
            }
            // Validation des données
            const allowedFields = ["nom", "email"];
            const updateData = {};
            for (const field of allowedFields) {
                if (profileData[field] !== undefined) {
                    updateData[field] = profileData[field];
                }
            }
            if (Object.keys(updateData).length === 0) {
                throw new ValidationError("Aucune donnée valide à mettre à jour");
            }
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            if (updateData.email) {
                const existingUser = await this.userRepository.findByEmail(updateData.email);
                if (existingUser && existingUser.id !== userIdNum) {
                    throw new ValidationError("Cet email est déjà utilisé par un autre utilisateur");
                }
            }
            // Mettre à jour l'utilisateur
            const utilisateur = await this.userRepository.update(userIdNum, updateData);
            if (!utilisateur) {
                throw new NotFoundError("Utilisateur non trouvé");
            }
            Logger.info("Profil mis à jour avec succès", { userId, updatedFields: Object.keys(updateData) });
            return { utilisateur };
        }
        catch (error) {
            Logger.error("Erreur lors de la mise à jour du profil", error, { userId });
            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError("Impossible de mettre à jour le profil");
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        try {
            Logger.info("Tentative de changement de mot de passe", { userId });
            const userIdNum = parseInt(userId, 10);
            if (isNaN(userIdNum)) {
                throw new ValidationError("ID utilisateur invalide");
            }
            // Validation des données
            if (!currentPassword || !newPassword) {
                throw new ValidationError("Mot de passe actuel et nouveau mot de passe requis");
            }
            if (newPassword.length < 6) {
                throw new ValidationError("Le nouveau mot de passe doit contenir au moins 6 caractères");
            }
            // Récupérer l'utilisateur
            const utilisateur = await this.userRepository.findById(userIdNum);
            if (!utilisateur) {
                throw new NotFoundError("Utilisateur non trouvé");
            }
            // Vérifier le mot de passe actuel
            const isValidPassword = await AuthUtils.verifyPassword(currentPassword, utilisateur.motDePasse);
            if (!isValidPassword) {
                throw new AuthenticationError("Mot de passe actuel incorrect");
            }
            // Hash du nouveau mot de passe
            const hashedNewPassword = await AuthUtils.hashPassword(newPassword);
            // Mettre à jour le mot de passe
            await this.userRepository.update(userIdNum, { motDePasse: hashedNewPassword });
            Logger.info("Mot de passe changé avec succès", { userId });
        }
        catch (error) {
            Logger.error("Erreur lors du changement de mot de passe", error, { userId });
            if (error instanceof ValidationError || error instanceof AuthenticationError || error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalServerError("Impossible de changer le mot de passe");
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
    generateTokensForUser(user, isEmployee) {
        let payload = {
            email: user.email,
        };
        if (isEmployee) {
            // Pour les employés (CAISSIER, VIGILE)
            payload.profil = user.roleUtilisateur;
            payload.employeId = user.id;
            payload.entrepriseId = user.entrepriseId;
        }
        else {
            // Pour les utilisateurs réguliers
            payload.profil = user.role;
            payload.entrepriseId = user.entrepriseId;
        }
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }
}
// Factory function pour créer le service avec les dépendances
export const createAuthService = (userRepository, employeRepository) => {
    return new AuthService(userRepository, employeRepository);
};
//# sourceMappingURL=authService.js.map