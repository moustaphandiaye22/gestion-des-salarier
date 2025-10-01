import { ProfessionService } from '../service/professionService.js';
const professionService = new ProfessionService();
export class ProfessionController {
    async getAll(req, res, next) {
        try {
            const professions = await professionService.getAll();
            res.json(professions);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const idParam = req.params.id;
            if (typeof idParam !== 'string') {
                return res.status(400).json({ error: "Le paramètre 'id' est requis." });
            }
            const id = parseInt(idParam);
            const profession = await professionService.getById(id);
            res.json(profession);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const data = req.body;
            const profession = await professionService.create(data);
            res.status(201).json(profession);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const idParam = req.params.id;
            if (typeof idParam !== 'string') {
                return res.status(400).json({ error: "Le paramètre 'id' est requis." });
            }
            const id = parseInt(idParam);
            const data = req.body;
            const profession = await professionService.update(id, data);
            res.json(profession);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const idParam = req.params.id;
            if (typeof idParam !== 'string') {
                return res.status(400).json({ error: "Le paramètre 'id' est requis." });
            }
            const id = parseInt(idParam);
            await professionService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=professionController.js.map