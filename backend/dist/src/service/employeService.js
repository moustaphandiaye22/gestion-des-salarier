import { employeRepository } from '../repositories/employe.js';
import { pointageRepository } from '../repositories/pointage.js';
import { employeSchema } from '../validators/employe.js';
import { QrCodeService } from './qrCodeService.js';
import { FileService } from './fileService.js';
export class EmployeService {
    employeRepository;
    pointageRepository;
    qrCodeService;
    fileService;
    constructor() {
        this.employeRepository = new employeRepository();
        this.pointageRepository = new pointageRepository();
        this.qrCodeService = new QrCodeService();
        this.fileService = new FileService();
    }
    async createEmploye(data) {
        const parsed = employeSchema.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        // Créer l'employé
        const employe = await this.employeRepository.create(data);
        // Générer automatiquement le QR code pour le nouvel employé
        try {
            const qrResult = await this.generateQrCodeWithFileSave(employe.id);
            console.log(`QR code généré automatiquement pour l'employé ${employe.prenom} ${employe.nom}`);
            console.log(`QR code sauvegardé à: ${qrResult.imagePath}`);
            // Vérifier que le fichier a bien été créé
            const fileExists = await this.fileService.qrCodeImageExists(qrResult.imagePath);
            if (fileExists) {
                console.log(`✅ Fichier QR code confirmé à: ${qrResult.imagePath}`);
            }
            else {
                console.error(`❌ Fichier QR code non trouvé après génération: ${qrResult.imagePath}`);
            }
        }
        catch (error) {
            console.error(`Erreur lors de la génération automatique du QR code pour l'employé ${employe.prenom} ${employe.nom}:`, error);
            // Log détaillé de l'erreur pour le debugging
            console.error('Détails de l\'erreur:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                employeId: employe.id,
                entrepriseId: employe.entrepriseId
            });
            // Ne pas bloquer la création de l'employé si la génération du QR code échoue
        }
        return employe;
    }
    async getEmploye(id) {
        return this.employeRepository.findById(id);
    }
    async getAllEmployes(user, entrepriseId) {
        if (user) {
            return this.employeRepository.findAllByUser(user, entrepriseId);
        }
        return this.employeRepository.findAll();
    }
    async updateEmploye(id, data) {
        const parsed = employeSchema.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return this.employeRepository.update(id, data);
    }
    async deleteEmploye(id) {
        return this.employeRepository.delete(id);
    }
    async filterEmployes(filters) {
        // Exemples de filtres avancés
        if (filters.statutEmploi)
            return this.employeRepository.findByStatus(filters.statutEmploi);
        if (filters.typeContrat)
            return this.employeRepository.findByTypeContrat(filters.typeContrat);
        if (filters.estActif === true)
            return this.employeRepository.findActifs();
        if (filters.estActif === false)
            return this.employeRepository.findInactifs();
        return this.employeRepository.findAll();
    }
    async setStatus(id, statutEmploi) {
        return this.employeRepository.setStatus(id, statutEmploi);
    }
    async bulkCreateEmployes(employes) {
        const results = {
            success: [],
            errors: []
        };
        for (let i = 0; i < employes.length; i++) {
            const data = employes[i];
            const parsed = employeSchema.safeParse(data);
            if (!parsed.success) {
                results.errors.push({ index: i, errors: parsed.error.issues });
                continue;
            }
            try {
                const created = await this.employeRepository.create(data);
                results.success.push(created);
            }
            catch (err) {
                results.errors.push({ index: i, errors: [{ message: err.message }] });
            }
        }
        return results;
    }
    async generateQrCode(employeId) {
        const employe = await this.employeRepository.findById(employeId);
        if (!employe) {
            throw new Error('Employé non trouvé');
        }
        const qrCodeDataURL = await this.qrCodeService.generateEmployeeQrCode(employeId, employe.entrepriseId);
        // Sauvegarder le QR code dans la base de données
        const qrContent = this.qrCodeService.generateQrContent(employeId, employe.entrepriseId);
        const updateData = {};
        updateData.qrCode = qrContent;
        updateData.qrCodeGenere = new Date();
        await this.employeRepository.update(employeId, updateData);
        return {
            qrCode: qrCodeDataURL,
            qrContent: qrContent,
            employe: {
                id: employe.id,
                nom: employe.nom,
                prenom: employe.prenom,
                matricule: employe.matricule
            }
        };
    }
    async regenerateQrCode(employeId) {
        return this.generateQrCode(employeId);
    }
    async getEmployeByQrCode(qrContent) {
        // D'abord essayer de valider comme QR code système (format EMP_...)
        const validation = this.qrCodeService.validateQrCode(qrContent);
        if (validation.isValid) {
            const employe = await this.employeRepository.findById(validation.employeId);
            if (!employe) {
                throw new Error('Employé non trouvé');
            }
            if (employe.entrepriseId !== validation.entrepriseId) {
                throw new Error('QR code ne correspond pas à l\'entreprise');
            }
            return employe;
        }
        // Si ce n'est pas un QR code système, essayer de chercher par matricule
        console.log(`QR code "${qrContent}" n'est pas un QR code système, recherche par matricule...`);
        const employe = await this.employeRepository.findByMatricule(qrContent);
        if (!employe) {
            throw new Error(`Aucun employé trouvé avec le matricule "${qrContent}"`);
        }
        console.log(`Employé trouvé par matricule: ${employe.prenom} ${employe.nom} (${employe.matricule})`);
        return employe;
    }
    async generateMultipleQrCodes(entrepriseId) {
        const employes = await this.employeRepository.findAllByUser({ profil: 'ADMIN_ENTREPRISE', entrepriseId }, entrepriseId);
        const qrCodes = {};
        for (const employe of employes) {
            const qrData = await this.generateQrCode(employe.id);
            qrCodes[employe.id] = qrData;
        }
        return qrCodes;
    }
    async generateQrCodeWithFileSave(employeId) {
        const employe = await this.employeRepository.findById(employeId);
        if (!employe) {
            throw new Error('Employé non trouvé');
        }
        const qrCodeDataURL = await this.qrCodeService.generateEmployeeQrCode(employeId, employe.entrepriseId);
        // Sauvegarder l'image QR code dans un fichier
        const imagePath = await this.fileService.saveQrCodeImage(qrCodeDataURL, employeId, employe.entrepriseId);
        const qrContent = this.qrCodeService.generateQrContent(employeId, employe.entrepriseId);
        // Mettre à jour l'employé avec le QR code et le chemin de l'image
        const updateData = {};
        updateData.qrCode = qrContent;
        updateData.qrCodeGenere = new Date();
        updateData.qrCodeImagePath = imagePath;
        await this.employeRepository.update(employeId, updateData);
        return {
            qrCode: qrCodeDataURL,
            qrContent: qrContent,
            imagePath: imagePath,
            employe: {
                id: employe.id,
                nom: employe.nom,
                prenom: employe.prenom,
                matricule: employe.matricule
            }
        };
    }
    async updatePresenceStats(employeId) {
        // Récupérer tous les pointages de l'employé
        const pointages = await this.pointageRepository.findByEmployeAndPeriode(employeId, new Date('2020-01-01'), new Date());
        let totalPresences = 0;
        let totalAbsences = 0;
        let totalRetards = 0;
        let totalHeures = 0;
        let dernierPointage = null;
        for (const pointage of pointages) {
            if (pointage.statut === 'PRESENT') {
                totalPresences++;
                if (pointage.dureeTravail) {
                    totalHeures += Number(pointage.dureeTravail);
                }
            }
            else if (pointage.statut === 'ABSENT') {
                totalAbsences++;
            }
            // Calculer les retards (heure d'entrée après 9h pour les présents)
            if (pointage.statut === 'PRESENT' && pointage.heureEntree) {
                const heureEntree = new Date(pointage.heureEntree);
                const heureLimite = new Date(pointage.heureEntree);
                heureLimite.setHours(9, 0, 0, 0); // 9h du matin
                if (heureEntree > heureLimite) {
                    totalRetards++;
                }
            }
            // Dernier pointage
            if (pointage.datePointage && (!dernierPointage || (pointage.datePointage && new Date(pointage.datePointage) > dernierPointage))) {
                dernierPointage = new Date(pointage.datePointage);
            }
        }
        // Mettre à jour les statistiques de l'employé
        const updateData = {};
        updateData.totalPresences = totalPresences;
        updateData.totalAbsences = totalAbsences;
        updateData.totalRetards = totalRetards;
        updateData.heuresTravaillees = totalHeures;
        updateData.dernierPointage = dernierPointage;
        await this.employeRepository.update(employeId, updateData);
        return {
            totalPresences,
            totalAbsences,
            totalRetards,
            totalHeures: Math.round(totalHeures * 100) / 100,
            dernierPointage
        };
    }
    async getEmployeStats(employeId) {
        const employe = await this.employeRepository.findById(employeId);
        if (!employe) {
            throw new Error('Employé non trouvé');
        }
        // Get current month dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        // Get pointages for current month
        const pointages = await this.pointageRepository.findByEmployeAndPeriode(employeId, startOfMonth, endOfMonth);
        // Calculate comprehensive statistics
        const totalPointages = pointages.length;
        const presentDays = pointages.filter(p => p.statut === 'PRESENT').length;
        const absentDays = pointages.filter(p => p.statut === 'ABSENT').length;
        const lateDays = pointages.filter(p => {
            if (p.heureEntree) {
                const entreeTime = new Date(`1970-01-01T${p.heureEntree}`);
                const expectedTime = new Date(`1970-01-01T09:00:00`); // 9h00
                return entreeTime > expectedTime;
            }
            return false;
        }).length;
        const totalHours = pointages.reduce((sum, p) => sum + (Number(p.dureeTravail) || 0), 0);
        // Calculate attendance rate
        const attendanceRate = totalPointages > 0 ? (presentDays / totalPointages) * 100 : 0;
        // Calculate average hours per day
        const avgHoursPerDay = totalPointages > 0 ? totalHours / totalPointages : 0;
        // Get last pointage
        const lastPointage = pointages.length > 0 ? pointages[0] : null;
        return {
            employe: {
                id: employe.id,
                nom: employe.nom,
                prenom: employe.prenom,
                matricule: employe.matricule
            },
            period: {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                monthName: now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
                startDate: startOfMonth,
                endDate: endOfMonth
            },
            statistics: {
                totalPointages,
                presentDays,
                absentDays,
                lateDays,
                totalHours: Math.round(totalHours * 100) / 100,
                attendanceRate: Math.round(attendanceRate * 100) / 100,
                avgHoursPerDay: Math.round(avgHoursPerDay * 100) / 100,
                lastPointage: lastPointage?.datePointage || null,
                lastEntryTime: lastPointage?.heureEntree || null,
                lastExitTime: lastPointage?.heureSortie || null
            }
        };
    }
    async updateEmployeStatsAfterPointage(employeId) {
        try {
            const stats = await this.getEmployeStats(employeId);
            // Update employee record with latest statistics
            const updateData = {
                dernierPointage: stats.statistics.lastPointage,
                heuresTravaillees: stats.statistics.totalHours,
                totalPresences: stats.statistics.presentDays,
                totalAbsences: stats.statistics.absentDays,
                totalRetards: stats.statistics.lateDays
            };
            await this.employeRepository.update(employeId, updateData);
            return stats;
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour des statistiques après pointage:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour des statistiques: ${errorMessage}`);
        }
    }
    async generateAllQrCodesForEntreprise(entrepriseId) {
        const employes = await this.employeRepository.findAllByUser({ profil: 'ADMIN_ENTREPRISE', entrepriseId }, entrepriseId);
        const results = {};
        for (const employe of employes) {
            try {
                const qrData = await this.generateQrCodeWithFileSave(employe.id);
                results[employe.id] = {
                    success: true,
                    data: qrData
                };
            }
            catch (error) {
                results[employe.id] = {
                    success: false,
                    error: error.message
                };
            }
        }
        return results;
    }
}
//# sourceMappingURL=employeService.js.map