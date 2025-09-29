import { utilisateurService } from '../service/utilisateurService.js';
import { utilisateurValidator } from '../validators/utilisateur.js';
export class UtilisateurController {
    async create(req, res) {
        try {
            const data = utilisateurValidator.parse(req.body);
            const utilisateur = await utilisateurService.createUtilisateur(data);
            res.status(201).json({ message: 'Utilisateur créé avec succès.', utilisateur });
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
    async getAll(req, res) {
        try {
            const utilisateurs = await utilisateurService.getAllUtilisateurs();
            res.json({ message: 'Liste des utilisateurs récupérée avec succès.', utilisateurs });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les utilisateurs : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const utilisateur = await utilisateurService.getUtilisateur(id);
            if (!utilisateur) {
                return res.status(404).json({ error: `Aucun utilisateur trouvé avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Utilisateur récupéré avec succès.', utilisateur });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer l'utilisateur : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = utilisateurValidator.partial().parse(req.body);
            const utilisateur = await utilisateurService.updateUtilisateur(id, data);
            res.json({ message: 'Utilisateur mis à jour avec succès.', utilisateur });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour de l'utilisateur : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await utilisateurService.deleteUtilisateur(id);
            res.status(200).json({ message: `Utilisateur avec l'identifiant ${id} supprimé avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer l'utilisateur : ${err.message}` });
        }
    }
}
//# sourceMappingURL=utilisateurController.js.map