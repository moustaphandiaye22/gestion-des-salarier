import { PointageService } from '../service/pointageService.js';
import { pointageSchema, pointageFilterSchema, pointageEntreeSchema, pointageSortieSchema } from '../validators/pointage.js';
const pointageService = new PointageService();
export class PointageController {
    async create(req, res) {
        try {
            const data = pointageSchema.parse(req.body);
            const pointage = await pointageService.createPointage(data);
            res.status(201).json({ message: 'Pointage créé avec succès.', pointage });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création du pointage : ${err.message}` });
            }
        }
    }
    async getAll(req, res) {
        try {
            const entrepriseId = req.query.entrepriseId ? parseInt(req.query.entrepriseId) : undefined;
            const pointages = await pointageService.getAllPointages(req.user, entrepriseId);
            res.json({ message: 'Liste des pointages récupérée avec succès.', pointages });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les pointages : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const pointage = await pointageService.getPointage(id);
            if (!pointage) {
                return res.status(404).json({ error: `Aucun pointage trouvé avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Pointage récupéré avec succès.', pointage });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer le pointage : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = pointageSchema.partial().parse(req.body);
            const pointage = await pointageService.updatePointage(id, data);
            res.json({ message: 'Pointage mis à jour avec succès.', pointage });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour du pointage : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await pointageService.deletePointage(id);
            res.status(200).json({ message: `Pointage avec l'identifiant ${id} supprimé avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer le pointage : ${err.message}` });
        }
    }
    async getByEmploye(req, res) {
        try {
            const employeId = Number(req.params.employeId);
            const pointages = await pointageService.getPointagesByEmploye(employeId);
            res.json({ message: 'Pointages de l\'employé récupérés avec succès.', pointages });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les pointages de l'employé : ${err.message}` });
        }
    }
    async getByEmployeAndPeriode(req, res) {
        try {
            const employeId = Number(req.params.employeId);
            const { dateDebut, dateFin } = req.query;
            if (!dateDebut || !dateFin) {
                return res.status(400).json({ error: 'Les dates de début et fin sont requises.' });
            }
            const pointages = await pointageService.getPointagesByEmployeAndPeriode(employeId, new Date(dateDebut), new Date(dateFin));
            res.json({ message: 'Pointages de l\'employé pour la période récupérés avec succès.', pointages });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les pointages : ${err.message}` });
        }
    }
    async getByEntrepriseAndDate(req, res) {
        try {
            const entrepriseId = Number(req.params.entrepriseId);
            const { dateDebut, dateFin } = req.query;
            if (!dateDebut || !dateFin) {
                return res.status(400).json({ error: 'Les dates de début et fin sont requises.' });
            }
            const pointages = await pointageService.getPointagesByEntrepriseAndDate(entrepriseId, new Date(dateDebut), new Date(dateFin));
            res.json({ message: 'Pointages de l\'entreprise pour la période récupérés avec succès.', pointages });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les pointages : ${err.message}` });
        }
    }
    async getByType(req, res) {
        try {
            const { type } = req.params;
            if (!type) {
                return res.status(400).json({ error: 'Type de pointage requis.' });
            }
            const pointages = await pointageService.getPointagesByType(type);
            res.json({ message: 'Pointages par type récupérés avec succès.', pointages });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les pointages : ${err.message}` });
        }
    }
    async getByStatut(req, res) {
        try {
            const { statut } = req.params;
            if (!statut) {
                return res.status(400).json({ error: 'Statut de pointage requis.' });
            }
            const pointages = await pointageService.getPointagesByStatut(statut);
            res.json({ message: 'Pointages par statut récupérés avec succès.', pointages });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les pointages : ${err.message}` });
        }
    }
    async pointerEntree(req, res) {
        try {
            const data = pointageEntreeSchema.parse(req.body);
            const pointage = await pointageService.pointerEntree(data.employeId, data.entrepriseId, data.lieu, data.ipAddress, data.localisation);
            res.status(201).json({ message: 'Pointage d\'entrée enregistré avec succès.', pointage });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec du pointage d'entrée : ${err.message}` });
            }
        }
    }
    async pointerSortie(req, res) {
        try {
            const data = pointageSortieSchema.parse(req.body);
            const pointage = await pointageService.pointerSortie(data.employeId, data.entrepriseId, data.lieu, data.ipAddress, data.localisation);
            res.json({ message: 'Pointage de sortie enregistré avec succès.', pointage });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec du pointage de sortie : ${err.message}` });
            }
        }
    }
    async calculateHeuresTravaillees(req, res) {
        try {
            const employeId = Number(req.params.employeId);
            const { dateDebut, dateFin } = req.query;
            if (!dateDebut || !dateFin) {
                return res.status(400).json({ error: 'Les dates de début et fin sont requises.' });
            }
            const heures = await pointageService.calculateHeuresTravaillees(employeId, new Date(dateDebut), new Date(dateFin));
            res.json({
                message: 'Heures travaillées calculées avec succès.',
                employeId,
                periode: { dateDebut, dateFin },
                heuresTravaillees: heures
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de calculer les heures travaillées : ${err.message}` });
        }
    }
    async getStatistiques(req, res) {
        try {
            const entrepriseId = Number(req.params.entrepriseId);
            const { dateDebut, dateFin } = req.query;
            if (!dateDebut || !dateFin) {
                return res.status(400).json({ error: 'Les dates de début et fin sont requises.' });
            }
            const statistiques = await pointageService.getStatistiques(entrepriseId, new Date(dateDebut), new Date(dateFin));
            res.json({ message: 'Statistiques récupérées avec succès.', statistiques });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les statistiques : ${err.message}` });
        }
    }
    async filter(req, res) {
        try {
            const filters = pointageFilterSchema.parse(req.query);
            const pointages = await pointageService.filterPointages(filters);
            res.json({ message: 'Pointages filtrés récupérés avec succès.', pointages });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des filtres.', details: err.errors });
            }
            else {
                res.status(500).json({ error: `Impossible de filtrer les pointages : ${err.message}` });
            }
        }
    }
    async bulkCreate(req, res) {
        try {
            if (!req.body.pointages || !Array.isArray(req.body.pointages)) {
                return res.status(400).json({ error: 'Un tableau de pointages est requis.' });
            }
            const results = await pointageService.bulkCreatePointages(req.body.pointages);
            res.status(200).json({
                message: `Import terminé. ${results.success.length} pointages créés, ${results.errors.length} erreurs.`,
                results
            });
        }
        catch (err) {
            res.status(500).json({ error: `Échec de l'import : ${err.message}` });
        }
    }
}
//# sourceMappingURL=pointageController.js.map