import { asyncHandler } from '../middleware/errorMiddleware.js';
import { Logger } from '../utils/logger.js';
export class UtilisateurController {
    utilisateurService;
    constructor(utilisateurService) {
        this.utilisateurService = utilisateurService;
    }
    create = asyncHandler(async (req, res) => {
        Logger.info('Requête de création d\'utilisateur reçue', { email: req.body.email });
        // Pour les admin entreprise, forcer l'entrepriseId à leur propre entreprise
        let userData = { ...req.body };
        if (req.user?.profil === 'ADMIN_ENTREPRISE' && req.user.entrepriseId) {
            userData.entrepriseId = req.user.entrepriseId;
        }
        const utilisateur = await this.utilisateurService.createUtilisateur(userData);
        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            utilisateur
        });
    });
    getAll = asyncHandler(async (req, res) => {
        Logger.info('Requête de récupération de tous les utilisateurs reçue');
        let utilisateurs = [];
        // Filtrer selon le rôle de l'utilisateur connecté
        if (req.user?.profil === 'SUPER_ADMIN') {
            utilisateurs = await this.utilisateurService.getAllUtilisateurs();
        }
        else if (req.user?.profil === 'ADMIN_ENTREPRISE' && req.user.entrepriseId) {
            utilisateurs = await this.utilisateurService.getUtilisateursByEntreprise(req.user.entrepriseId);
        }
        else {
            // Pour les autres rôles, ne rien retourner ou lever une erreur
            utilisateurs = [];
        }
        res.json({
            message: 'Liste des utilisateurs récupérée avec succès.',
            utilisateurs
        });
    });
    getById = asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        Logger.info('Requête de récupération d\'utilisateur par ID reçue', { id });
        const utilisateur = await this.utilisateurService.getUtilisateur(id);
        res.json({
            message: 'Utilisateur récupéré avec succès.',
            utilisateur
        });
    });
    update = asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        Logger.info('Requête de mise à jour d\'utilisateur reçue', { id });
        const utilisateur = await this.utilisateurService.updateUtilisateur(id, req.body);
        res.json({
            message: 'Utilisateur mis à jour avec succès.',
            utilisateur
        });
    });
    delete = asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        Logger.info('Requête de suppression d\'utilisateur reçue', { id });
        await this.utilisateurService.deleteUtilisateur(id);
        res.json({
            message: `Utilisateur avec l'identifiant ${id} supprimé avec succès.`
        });
    });
}
// Factory function pour créer le controller avec les dépendances
export const createUtilisateurController = (utilisateurService) => {
    return new UtilisateurController(utilisateurService);
};
//# sourceMappingURL=utilisateurController.js.map