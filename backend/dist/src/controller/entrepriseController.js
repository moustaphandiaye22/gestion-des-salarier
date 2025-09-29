import { EntrepriseService } from '../service/entrepriseService.js';
import { entrepriseSchema } from '../validators/entreprise.js';
const entrepriseService = new EntrepriseService();
export class EntrepriseController {
    async create(req, res) {
        try {
            const data = entrepriseSchema.parse(req.body);
            const entreprise = await entrepriseService.createEntreprise(data);
            res.status(201).json({ message: 'Entreprise créée avec succès.', entreprise });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création de l'entreprise : ${err.message}` });
            }
        }
    }
    async getAll(req, res) {
        try {
            const entreprises = await entrepriseService.getAllEntreprises();
            res.json({ message: 'Liste des entreprises récupérée avec succès.', entreprises });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les entreprises : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const entreprise = await entrepriseService.getEntreprise(id);
            if (!entreprise) {
                return res.status(404).json({ error: `Aucune entreprise trouvée avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Entreprise récupérée avec succès.', entreprise });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer l'entreprise : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = entrepriseSchema.partial().parse(req.body);
            const entreprise = await entrepriseService.updateEntreprise(id, data);
            res.json({ message: 'Entreprise mise à jour avec succès.', entreprise });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour de l'entreprise : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await entrepriseService.deleteEntreprise(id);
            res.status(200).json({ message: `Entreprise avec l'identifiant ${id} supprimée avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer l'entreprise : ${err.message}` });
        }
    }
}
//# sourceMappingURL=entrepriseController.js.map