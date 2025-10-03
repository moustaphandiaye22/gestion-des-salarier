import { QrCodeService } from '../service/qrCodeService.js';
import { EmployeService } from '../service/employeService.js';
import { PointageService } from '../service/pointageService.js';
const qrCodeService = new QrCodeService();
const employeService = new EmployeService();
const pointageService = new PointageService();
export class QrCodeController {
    async generateEmployeeQr(req, res) {
        try {
            const { employeId } = req.params;
            const id = Number(employeId);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const result = await employeService.generateQrCode(id);
            res.json({
                message: 'QR code généré avec succès.',
                ...result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de générer le QR code : ${err.message}` });
        }
    }
    async generateMultipleQrCodes(req, res) {
        try {
            const { entrepriseId } = req.params;
            const id = Number(entrepriseId);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID entreprise invalide.' });
            }
            const result = await employeService.generateMultipleQrCodes(id);
            res.json({
                message: 'QR codes générés avec succès.',
                qrCodes: result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de générer les QR codes : ${err.message}` });
        }
    }
    async regenerateEmployeeQr(req, res) {
        try {
            const { employeId } = req.params;
            const id = Number(employeId);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const result = await employeService.regenerateQrCode(id);
            res.json({
                message: 'QR code régénéré avec succès.',
                ...result
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de régénérer le QR code : ${err.message}` });
        }
    }
    async scanQrCode(req, res) {
        try {
            const { qrContent } = req.body;
            if (!qrContent) {
                return res.status(400).json({ error: 'Contenu QR code requis.' });
            }
            // Valider le QR code
            const validation = qrCodeService.validateQrCode(qrContent);
            if (!validation.isValid) {
                return res.status(400).json({ error: 'QR code invalide.' });
            }
            // Récupérer l'employé
            const employe = await employeService.getEmployeByQrCode(qrContent);
            res.json({
                message: 'QR code validé avec succès.',
                employe: {
                    id: employe.id,
                    nom: employe.nom,
                    prenom: employe.prenom,
                    matricule: employe.matricule,
                    entrepriseId: employe.entrepriseId
                }
            });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async pointerParQrCode(req, res) {
        try {
            const { qrContent, lieu, ipAddress, localisation } = req.body;
            if (!qrContent) {
                return res.status(400).json({ error: 'Contenu QR code requis.' });
            }
            // Valider le QR code et récupérer l'employé
            const validation = qrCodeService.validateQrCode(qrContent);
            if (!validation.isValid) {
                return res.status(400).json({ error: 'QR code invalide.' });
            }
            const employe = await employeService.getEmployeByQrCode(qrContent);
            // Vérifier si c'est une entrée ou une sortie
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const existingPointages = await pointageService.getPointagesByEmploye(employe.id);
            const todayPointages = existingPointages.filter(p => new Date(p.datePointage).toDateString() === today.toDateString());
            const hasEntree = todayPointages.some(p => p.heureEntree && !p.heureSortie);
            if (hasEntree) {
                // Pointer la sortie
                const pointage = await pointageService.pointerSortie(employe.id, employe.entrepriseId, lieu, ipAddress, localisation);
                res.json({
                    message: 'Sortie pointée avec succès via QR code.',
                    action: 'sortie',
                    pointage
                });
            }
            else {
                // Pointer l'entrée
                const pointage = await pointageService.pointerEntree(employe.id, employe.entrepriseId, lieu, ipAddress, localisation);
                res.json({
                    message: 'Entrée pointée avec succès via QR code.',
                    action: 'entree',
                    pointage
                });
            }
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async getQrCodeInfo(req, res) {
        try {
            const { employeId } = req.params;
            const id = Number(employeId);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID employé invalide.' });
            }
            const employe = await employeService.getEmploye(id);
            if (!employe) {
                return res.status(404).json({ error: 'Employé non trouvé.' });
            }
            res.json({
                message: 'Informations QR code récupérées.',
                employe: {
                    id: employe.id,
                    nom: employe.nom,
                    prenom: employe.prenom,
                    matricule: employe.matricule,
                    qrCodeGenere: employe.qrCodeGenere,
                    hasQrCode: !!employe.qrCode
                }
            });
        }
        catch (err) {
            res.status(500).json({ error: `Impossible de récupérer les informations : ${err.message}` });
        }
    }
}
//# sourceMappingURL=qrCodeController.js.map