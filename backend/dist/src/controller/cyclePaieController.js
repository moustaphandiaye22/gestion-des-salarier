import { CyclePaieService } from '../service/cyclePaieService.js';
import { cyclePaieSchema } from '../validators/cyclePaie.js';
const cyclePaieService = new CyclePaieService();
export class CyclePaieController {
    async create(req, res) {
        try {
            const data = cyclePaieSchema.parse(req.body);
            const cycle = await cyclePaieService.createCyclePaie(data);
            res.status(201).json({ message: 'Cycle de paie créé avec succès.', cycle });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création du cycle de paie : ${err.message}` });
            }
        }
    }
    async getAll(req, res) {
        try {
            const cycles = await cyclePaieService.getAllCyclesPaie(req.user);
            res.json({ message: 'Liste des cycles de paie récupérée avec succès.', cycles });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les cycles de paie : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const cycle = await cyclePaieService.getCyclePaie(id);
            if (!cycle) {
                return res.status(404).json({ error: `Aucun cycle de paie trouvé avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Cycle de paie récupéré avec succès.', cycle });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer le cycle de paie : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = cyclePaieSchema.partial().parse(req.body);
            const cycle = await cyclePaieService.updateCyclePaie(id, data);
            res.json({ message: 'Cycle de paie mis à jour avec succès.', cycle });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour du cycle de paie : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await cyclePaieService.deleteCyclePaie(id);
            res.status(200).json({ message: `Cycle de paie avec l'identifiant ${id} supprimé avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer le cycle de paie : ${err.message}` });
        }
    }
}
//# sourceMappingURL=cyclePaieController.js.map