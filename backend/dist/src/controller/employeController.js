import { EmployeService } from '../service/employeService.js';
import { SalaryCalculationService } from '../service/salaryCalculationService.js';
import { ExportService } from '../service/exportService.js';
import { employeSchema } from '../validators/employe.js';
import * as XLSX from 'xlsx';
import * as fs from 'fs/promises';
import * as path from 'path';
import multer from 'multer';
const employeService = new EmployeService();
const salaryCalculationService = new SalaryCalculationService();
const exportService = new ExportService();
export class EmployeController {
    async create(req, res) {
        try {
            const data = employeSchema.parse(req.body);
            const employe = await employeService.createEmploye(data);
            res.status(201).json({ message: 'Employé créé avec succès.', employe });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la création de l'employé : ${err.message}` });
            }
        }
    }
    async getAll(req, res) {
        try {
            const entrepriseId = req.query.entrepriseId ? parseInt(req.query.entrepriseId) : undefined;
            const employes = await employeService.getAllEmployes(req.user, entrepriseId);
            res.json({ message: 'Liste des employés récupérée avec succès.', employes });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les employés : ${err.message}` });
        }
    }
    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const employe = await employeService.getEmploye(id);
            if (!employe) {
                return res.status(404).json({ error: `Aucun employé trouvé avec l'identifiant ${id}.` });
            }
            res.json({ message: 'Employé récupéré avec succès.', employe });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer l'employé : ${err.message}` });
        }
    }
    async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = employeSchema.partial().parse(req.body);
            const employe = await employeService.updateEmploye(id, data);
            res.json({ message: 'Employé mis à jour avec succès.', employe });
        }
        catch (err) {
            if (err.errors) {
                res.status(400).json({ error: 'Erreur de validation des données.', details: err.errors });
            }
            else {
                res.status(400).json({ error: `Échec de la mise à jour de l'employé : ${err.message}` });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await employeService.deleteEmploye(id);
            res.status(200).json({ message: `Employé avec l'identifiant ${id} supprimé avec succès.` });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de supprimer l'employé : ${err.message}` });
        }
    }
    async getLatestBulletin(req, res) {
        try {
            const employeeId = Number(req.params.id);
            const bulletin = await salaryCalculationService.getLatestBulletin(employeeId);
            if (!bulletin) {
                return res.status(404).json({ error: `Aucun bulletin trouvé pour l'employé ${employeeId}.` });
            }
            res.json({ message: 'Bulletin récupéré avec succès.', bulletin });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer le bulletin : ${err.message}` });
        }
    }
    async bulkImport(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Aucun fichier fourni.' });
            }
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            if (!sheetName) {
                return res.status(400).json({ error: 'Aucune feuille trouvée dans le fichier Excel.' });
            }
            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet) {
                return res.status(400).json({ error: 'Feuille de calcul invalide.' });
            }
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            // Use entrepriseId from form data if provided (for super admin), otherwise from user
            let entrepriseId = undefined;
            if (req.body.entrepriseId) {
                entrepriseId = parseInt(req.body.entrepriseId);
            }
            else if (req.user?.profil === 'SUPER_ADMIN') {
                // If super admin and no entrepriseId provided, reject
                return res.status(400).json({ error: 'ID de l\'entreprise requis pour super admin.' });
            }
            else {
                const user = req.user;
                entrepriseId = user?.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'ID de l\'entreprise requis.' });
            }
            const employes = jsonData.map((row) => ({
                ...row,
                entrepriseId,
                dateEmbauche: new Date(row.dateEmbauche),
                salaireBase: parseFloat(row.salaireBase),
                allocations: row.allocations ? parseFloat(row.allocations) : 0,
                deductions: row.deductions ? parseFloat(row.deductions) : 0,
                salaireHoraire: row.salaireHoraire ? parseFloat(row.salaireHoraire) : null,
                tauxJournalier: row.tauxJournalier ? parseFloat(row.tauxJournalier) : null,
                professionId: row.professionId ? parseInt(row.professionId) : null,
                estActif: row.estActif !== undefined ? Boolean(row.estActif) : true,
            }));
            const results = await employeService.bulkCreateEmployes(employes);
            res.status(200).json({
                message: `Import terminé. ${results.success.length} employés créés, ${results.errors.length} erreurs.`,
                results
            });
        }
        catch (err) {
            res.status(500).json({ error: `Échec de l'import : ${err.message}` });
        }
    }
    async exportTemplate(req, res) {
        try {
            const buffer = await exportService.exportEmployeeTemplate();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="modele-employes.xlsx"');
            res.send(buffer);
        }
        catch (err) {
            res.status(500).json({ error: `Échec de l'export du modèle : ${err.message}` });
        }
    }
    async generateQrCode(req, res) {
        try {
            const { id } = req.params;
            const employeId = Number(id);
            if (isNaN(employeId)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const result = await employeService.generateQrCodeWithFileSave(employeId);
            res.json({
                message: 'QR code généré avec succès.',
                ...result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de générer le QR code : ${err.message}` });
        }
    }
    async regenerateQrCode(req, res) {
        try {
            const { id } = req.params;
            const employeId = Number(id);
            if (isNaN(employeId)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const result = await employeService.regenerateQrCode(employeId);
            res.json({
                message: 'QR code régénéré avec succès.',
                ...result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de régénérer le QR code : ${err.message}` });
        }
    }
    async getEmployeStats(req, res) {
        try {
            const { id } = req.params;
            const employeId = Number(id);
            if (isNaN(employeId)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const result = await employeService.getEmployeStats(employeId);
            res.json({
                message: 'Statistiques récupérées avec succès.',
                ...result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les statistiques : ${err.message}` });
        }
    }
    async updatePresenceStats(req, res) {
        try {
            const { id } = req.params;
            const employeId = Number(id);
            if (isNaN(employeId)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const result = await employeService.updatePresenceStats(employeId);
            res.json({
                message: 'Statistiques de présence mises à jour avec succès.',
                statistiques: result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de mettre à jour les statistiques : ${err.message}` });
        }
    }
    async generateAllQrCodes(req, res) {
        try {
            const { entrepriseId } = req.params;
            const id = Number(entrepriseId);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID entreprise invalide.' });
            }
            const result = await employeService.generateAllQrCodesForEntreprise(id);
            res.json({
                message: 'Génération des QR codes terminée.',
                results: result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de générer les QR codes : ${err.message}` });
        }
    }
    async getQrCodeImage(req, res) {
        try {
            const { id } = req.params;
            const employeId = Number(id);
            if (isNaN(employeId)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const employe = await employeService.getEmploye(employeId);
            if (!employe) {
                return res.status(404).json({ error: 'Employé non trouvé.' });
            }
            if (!employe.qrCodeImagePath) {
                return res.status(404).json({ error: 'QR code non généré pour cet employé.' });
            }
            const imagePath = employe.qrCodeImagePath;
            const fullPath = path.join(process.cwd(), 'assets', imagePath);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            const imageBuffer = await fs.readFile(fullPath);
            res.send(imageBuffer);
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer l'image QR code : ${err.message}` });
        }
    }
}
//# sourceMappingURL=employeController.js.map