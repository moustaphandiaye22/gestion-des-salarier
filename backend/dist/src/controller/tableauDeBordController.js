import { tableauDeBordService } from '../service/tableauDeBordService.js';
import { tableauDeBordValidator } from '../validators/tableauDeBord.js';
export class TableauDeBordController {
    async create(req, res) {
        try {
            const data = tableauDeBordValidator.parse(req.body);
            const tableau = await tableauDeBordService.createTableauDeBord(data);
            res.status(201).json(tableau);
        }
        catch (err) {
            res.status(400).json({ error: err.errors || err.message });
        }
    }
    async getAll(req, res) {
        try {
            const tableaux = await tableauDeBordService.getAllTableauxDeBord();
            res.json(tableaux);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const tableau = await tableauDeBordService.getTableauDeBord(id);
            if (!tableau)
                return res.status(404).json({ error: 'Tableau de bord non trouvé' });
            res.json(tableau);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = tableauDeBordValidator.partial().parse(req.body);
            const tableau = await tableauDeBordService.updateTableauDeBord(id, data);
            res.json(tableau);
        }
        catch (err) {
            res.status(400).json({ error: err.errors || err.message });
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await tableauDeBordService.deleteTableauDeBord(id);
            res.status(204).send();
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
//# sourceMappingURL=tableauDeBordController.js.map