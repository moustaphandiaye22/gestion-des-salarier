import { PaiementService } from '../service/paiementService.js';
import { paiementSchema } from '../validators/paiement.js';
import { PDFService } from '../service/pdfService.js';
import { ExportService } from '../service/exportService.js';
const paiementService = new PaiementService();
const exportService = new ExportService();
export class PaiementController {
    async create(req, res) {
        try {
            const data = paiementSchema.parse(req.body);
            // Add user ID for audit logging
            const paiementData = {
                ...data,
                utilisateurId: req.user?.id
            };
            const paiement = await paiementService.createPaiement(paiementData);
            res.status(201).json({ message: 'Paiement créé avec succès.', paiement });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création du paiement : ${err.message}` });
            }
        }
    }
    async getAll(req, res) {
        try {
            const paiements = await paiementService.getAllPaiements(req.user);
            res.json({ message: 'Liste des paiements récupérée avec succès.', paiements });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les paiements : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const paiement = await paiementService.getPaiement(id);
            if (!paiement) {
                return res.status(404).json({ error: `Aucun paiement trouvé avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Paiement récupéré avec succès.', paiement });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer le paiement : ${err.message}` });
        }
    }
    async generateReceiptPDF(req, res) {
        try {
            const id = Number(req.params.id);
            const paiement = await paiementService.getPaiement(id);
            if (!paiement) {
                return res.status(404).json({ error: `Aucun paiement trouvé avec l'identifiant ${id}.` });
            }
            const pdfBuffer = await PDFService.generatePaymentReceipt(paiement);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=receipt_${id}.pdf`);
            res.send(pdfBuffer);
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de générer le reçu PDF : ${err.message}` });
        }
    }
    async generatePaymentListPDF(req, res) {
        try {
            const paiements = await paiementService.getAllPaiements(req.user);
            const pdfBuffer = await PDFService.generatePaymentList(paiements);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=payment_list.pdf');
            res.send(pdfBuffer);
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de générer la liste des paiements PDF : ${err.message}` });
        }
    }
    async exportToExcel(req, res) {
        try {
            const buffer = await exportService.exportPaiementsToExcel(req.user);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=paiements.xlsx');
            res.send(buffer);
        }
        catch (err) {
            res.status(500).json({ error: `Impossible d'exporter les paiements : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = paiementSchema.partial().parse(req.body);
            const paiement = await paiementService.updatePaiement(id, data);
            // If payment status changed to PAYE, generate the bulletin PDF automatically
            if (data.statut === 'PAYE') {
                const pdfBuffer = await PDFService.generatePaymentReceipt(paiement);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=receipt_${id}.pdf`);
                return res.send(pdfBuffer);
            }
            res.json({ message: 'Paiement mis à jour avec succès.', paiement });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour du paiement : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await paiementService.deletePaiement(id);
            res.status(200).json({ message: `Paiement avec l'identifiant ${id} supprimé avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer le paiement : ${err.message}` });
        }
    }
}
//# sourceMappingURL=paiementController.js.map