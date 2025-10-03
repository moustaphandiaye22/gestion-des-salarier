import { BulletinService } from '../service/bulletinService.js';
import { bulletinSchema } from '../validators/bulletin.js';
import { PDFService } from '../service/pdfService.js';
import { ExportService } from '../service/exportService.js';
const bulletinService = new BulletinService();
const exportService = new ExportService();
export class BulletinController {
    async create(req, res) {
        try {
            const data = bulletinSchema.parse(req.body);
            const bulletin = await bulletinService.createBulletin(data);
            res.status(201).json({ message: 'Bulletin créé avec succès.', bulletin });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création du bulletin : ${err.message}` });
            }
        }
    }
    async getAll(req, res) {
        try {
            const bulletins = await bulletinService.getAllBulletins(req.user);
            res.json({ message: 'Liste des bulletins récupérée avec succès.', bulletins });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les bulletins : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const bulletin = await bulletinService.getBulletin(id);
            if (!bulletin) {
                return res.status(404).json({ error: `Aucun bulletin trouvé avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Bulletin récupéré avec succès.', bulletin });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer le bulletin : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = bulletinSchema.partial().parse(req.body);
            const bulletin = await bulletinService.updateBulletin(id, data);
            res.json({ message: 'Bulletin mis à jour avec succès.', bulletin });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour du bulletin : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await bulletinService.deleteBulletin(id);
            res.status(200).json({ message: `Bulletin avec l'identifiant ${id} supprimé avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer le bulletin : ${err.message}` });
        }
    }
    async generatePDF(req, res) {
        try {
            const id = Number(req.params.id);
            const bulletin = await bulletinService.getBulletin(id);
            if (!bulletin) {
                return res.status(404).json({ error: `Aucun bulletin trouvé avec l'identifiant ${id}.` });
            }
            const pdfBuffer = await PDFService.generatePayslip(bulletin);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=bulletin-${id}.pdf`);
            res.send(pdfBuffer);
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de générer le PDF : ${err.message}` });
        }
    }
    async exportToExcel(req, res) {
        try {
            const buffer = await exportService.exportBulletinsToExcel(req.user);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=bulletins.xlsx');
            res.send(buffer);
        }
        catch (err) {
            res.status(500).json({ error: `Impossible d'exporter les bulletins : ${err.message}` });
        }
    }
}
//# sourceMappingURL=bulletinController.js.map