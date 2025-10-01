import { rapportService } from '../service/rapportService.js';
import { rapportValidator } from '../validators/rapport.js';
export class RapportController {
    async create(req, res) {
        try {
            const data = rapportValidator.parse(req.body);
            const rapport = await rapportService.createRapport(data);
            res.status(201).json(rapport);
        }
        catch (err) {
            res.status(400).json({ error: err.errors || err.message });
        }
    }
    async getAll(req, res) {
        try {
            const rapports = await rapportService.getAllRapports(req.user);
            res.json(rapports);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const rapport = await rapportService.getRapport(id);
            if (!rapport)
                return res.status(404).json({ error: 'Rapport non trouvé' });
            res.json(rapport);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = rapportValidator.partial().parse(req.body);
            const rapport = await rapportService.updateRapport(id, data);
            res.json(rapport);
        }
        catch (err) {
            res.status(400).json({ error: err.errors || err.message });
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await rapportService.deleteRapport(id);
            res.status(204).send();
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
//# sourceMappingURL=rapportController.js.map