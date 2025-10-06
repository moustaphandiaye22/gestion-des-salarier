import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class PDFService {
    static async generatePayslip(bulletinData) {
        return new Promise((resolve, reject) => {
            // Set up document with margins
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true
            });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);
            try {
                // Validate bulletin data structure
                if (!bulletinData || !bulletinData.employe || !bulletinData.employe.entreprise || !bulletinData.cycle) {
                    throw new Error('Données du bulletin incomplètes');
                }
                const entreprise = bulletinData.employe.entreprise;
                const employe = bulletinData.employe;
                const cycle = bulletinData.cycle;
                // Company colors
                const primaryColor = entreprise.couleurPrimaire || '#2563eb'; // Default blue
                const secondaryColor = entreprise.couleurSecondaire || '#64748b'; // Default gray
                // Header with company branding
                doc.fillColor(primaryColor);
                // Company logo (if exists)
                let logoY = 40;
                if (entreprise.logo) {
                    try {
                        const logoPath = path.resolve(__dirname, '..', 'assets', 'images', 'logos', entreprise.logo);
                        if (fs.existsSync(logoPath)) {
                            doc.image(logoPath, 40, logoY, { width: 80, height: 80 });
                        }
                    }
                    catch (error) {
                        console.log('Logo not found:', error);
                    }
                }
                // Company information
                doc.fontSize(20).font('Helvetica-Bold');
                doc.fillColor(primaryColor);
                doc.text(entreprise.nom, 140, logoY + 10);
                doc.fontSize(10).font('Helvetica');
                doc.fillColor('#666666');
                let infoY = logoY + 35;
                if (entreprise.adresse) {
                    doc.text(entreprise.adresse, 140, infoY);
                    infoY += 15;
                }
                if (entreprise.telephone) {
                    doc.text(`Tél: ${entreprise.telephone}`, 140, infoY);
                    infoY += 15;
                }
                if (entreprise.email) {
                    doc.text(`Email: ${entreprise.email}`, 140, infoY);
                }
                // Title
                doc.moveDown(3);
                doc.fontSize(22).font('Helvetica-Bold');
                doc.fillColor(primaryColor);
                doc.text('BULLETIN DE PAIE', { align: 'left' });
                // Period and bulletin info
                doc.moveDown(1);
                doc.fontSize(11).font('Helvetica');
                doc.fillColor('#333333');
                doc.text(`Période du ${new Date(cycle.dateDebut).toLocaleDateString('fr-FR')} au ${new Date(cycle.dateFin).toLocaleDateString('fr-FR')}`, { align: 'left' });
                doc.moveDown(0.5);
                doc.text(`Bulletin N°: ${bulletinData.numeroBulletin || 'N/A'}`, { align: 'left' });
                // Employee information section
                doc.moveDown(2);
                doc.fontSize(14).font('Helvetica-Bold');
                doc.fillColor(primaryColor);
                doc.text('IDENTIFICATION DE L\'EMPLOYÉ', { align: 'left' });
                // Employee details in a professional table format
                doc.moveDown(1);
                doc.fontSize(10).font('Helvetica');
                const employeeInfo = [
                    ['Matricule:', employe.matricule, 'Numéro CNSS:', employe.numeroCnss || 'N/A'],
                    ['Nom et Prénom:', `${employe.prenom} ${employe.nom}`, 'Situation familiale:', employe.situationFamiliale || 'N/A'],
                    ['Poste:', employe.profession?.nom || 'N/A', 'Catégorie:', employe.categorie || 'N/A'],
                    ['Département:', 'N/A', 'Date d\'embauche:', new Date(employe.dateEmbauche).toLocaleDateString('fr-FR')]
                ];
                employeeInfo.forEach(row => {
                    doc.fillColor('#f8f9fa');
                    doc.rect(40, doc.y, 515, 20).fill();
                    doc.fillColor('#333333');
                    doc.font('Helvetica-Bold');
                    doc.text(row[0], 50, doc.y + 5, { width: 120 });
                    doc.font('Helvetica');
                    doc.text(row[1], 170, doc.y + 5, { width: 120 });
                    doc.font('Helvetica-Bold');
                    doc.text(row[2], 310, doc.y + 5, { width: 120 });
                    doc.font('Helvetica');
                    doc.text(row[3], 430, doc.y + 5, { width: 120 });
                    doc.moveDown(1.2);
                });
                // Remuneration details section
                doc.moveDown(2);
                doc.fontSize(14).font('Helvetica-Bold');
                doc.fillColor(primaryColor);
                doc.text('DÉTAIL DES RÉMUNÉRATIONS', { align: 'left' });
                // Convert Decimal to number
                const salaireBase = Number(bulletinData.salaireBase);
                const allocations = Number(bulletinData.allocations);
                const deductions = Number(bulletinData.deductions);
                const totalAPayer = Number(bulletinData.totalAPayer);
                // Earnings table
                doc.moveDown(1);
                // Table header
                doc.fillColor(primaryColor);
                doc.rect(40, doc.y, 515, 25).fill();
                doc.fillColor('white');
                doc.fontSize(11).font('Helvetica-Bold');
                doc.text('LIBELLÉ', 50, doc.y + 7);
                doc.text('BASE', 300, doc.y + 7);
                doc.text('TAUX', 380, doc.y + 7);
                doc.text('MONTANT (FCFA)', 450, doc.y + 7);
                doc.moveDown(1.8);
                // Earnings items
                const earnings = [
                    { libelle: 'Salaire de base', base: '1 mois', taux: '100%', montant: salaireBase },
                    { libelle: 'Allocations familiales', base: '2 enfants', taux: '15%', montant: allocations },
                    { libelle: 'Heures supplémentaires', base: '0h', taux: '150%', montant: 0 },
                    { libelle: 'Prime d\'ancienneté', base: '2 ans', taux: '5%', montant: 0 },
                    { libelle: 'Prime de rendement', base: 'N/A', taux: '0%', montant: 0 }
                ];
                earnings.forEach((item, index) => {
                    if (item.montant > 0 || index < 2) { // Show base salary and allocations always
                        const bgColor = index % 2 === 0 ? '#f8f9fa' : 'white';
                        doc.fillColor(bgColor);
                        doc.rect(40, doc.y, 515, 20).fill();
                        doc.fillColor('#333333');
                        doc.fontSize(9).font('Helvetica');
                        doc.text(item.libelle, 50, doc.y + 5, { width: 240 });
                        doc.text(item.base, 300, doc.y + 5, { width: 70 });
                        doc.text(item.taux, 380, doc.y + 5, { width: 60 });
                        doc.text(item.montant.toLocaleString('fr-FR'), 450, doc.y + 5, { width: 80, align: 'right' });
                        doc.moveDown(1.2);
                    }
                });
                // Total earnings
                doc.fillColor(primaryColor);
                doc.rect(40, doc.y, 515, 25).fill();
                doc.fillColor('white');
                doc.fontSize(11).font('Helvetica-Bold');
                doc.text('TOTAL BRUT', 50, doc.y + 7);
                doc.text(`${(salaireBase + allocations).toLocaleString('fr-FR')} FCFA`, 450, doc.y + 7, { align: 'right' });
                // Deductions section
                doc.moveDown(3);
                doc.fontSize(14).font('Helvetica-Bold');
                doc.fillColor(primaryColor);
                doc.text('DÉDUCTIONS ET RETENUES', { align: 'left' });
                doc.moveDown(1);
                // Deductions table header
                doc.fillColor(primaryColor);
                doc.rect(40, doc.y, 515, 25).fill();
                doc.fillColor('white');
                doc.fontSize(11).font('Helvetica-Bold');
                doc.text('LIBELLÉ', 50, doc.y + 7);
                doc.text('BASE', 300, doc.y + 7);
                doc.text('TAUX', 380, doc.y + 7);
                doc.text('MONTANT (FCFA)', 450, doc.y + 7);
                doc.moveDown(1.8);
                // Deductions items
                const deductionsList = [
                    { libelle: 'Cotisations sociales (employé)', base: salaireBase.toString(), taux: '5.75%', montant: deductions * 0.7 },
                    { libelle: 'Impôt sur le revenu', base: (salaireBase * 0.9).toString(), taux: 'variable', montant: deductions * 0.3 },
                    { libelle: 'Retenue syndicale', base: '0', taux: '0%', montant: 0 },
                    { libelle: 'Assurance santé', base: '0', taux: '0%', montant: 0 }
                ];
                deductionsList.forEach((item, index) => {
                    if (item.montant > 0) {
                        const bgColor = index % 2 === 0 ? '#f8f9fa' : 'white';
                        doc.fillColor(bgColor);
                        doc.rect(40, doc.y, 515, 20).fill();
                        doc.fillColor('#333333');
                        doc.fontSize(9).font('Helvetica');
                        doc.text(item.libelle, 50, doc.y + 5, { width: 240 });
                        doc.text(item.base, 300, doc.y + 5, { width: 70 });
                        doc.text(item.taux, 380, doc.y + 5, { width: 60 });
                        doc.text(item.montant.toLocaleString('fr-FR'), 450, doc.y + 5, { width: 80, align: 'right' });
                        doc.moveDown(1.2);
                    }
                });
                // Total deductions
                doc.fillColor(primaryColor);
                doc.rect(40, doc.y, 515, 25).fill();
                doc.fillColor('white');
                doc.fontSize(11).font('Helvetica-Bold');
                doc.text('TOTAL DÉDUCTIONS', 50, doc.y + 7);
                doc.text(`${deductions.toLocaleString('fr-FR')} FCFA`, 450, doc.y + 7, { align: 'right' });
                // Net salary section
                doc.moveDown(3);
                doc.fontSize(16).font('Helvetica-Bold');
                doc.fillColor(primaryColor);
                doc.text('NET À PAYER', { align: 'center' });
                doc.moveDown(1);
                doc.fontSize(18).font('Helvetica-Bold');
                doc.fillColor('#2563eb');
                doc.text(`${totalAPayer.toLocaleString('fr-FR')} FCFA`, { align: 'center' });
                // Footer with legal information
                doc.moveDown(4);
                doc.fontSize(8).font('Helvetica');
                doc.fillColor('#666666');
                // Signature area
                doc.text('Le présent bulletin est établi conformément aux dispositions légales en vigueur.', 40, doc.y, { align: 'left' });
                doc.moveDown(1);
                doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, 40, doc.y);
                doc.text('Signature de l\'employeur', 400, doc.y);
                // Legal footer
                doc.moveDown(3);
                doc.fontSize(7);
                doc.fillColor('#999999');
                doc.text('Ce document est confidentiel et destiné uniquement au destinataire. Toute reproduction ou diffusion sans autorisation est interdite.', { align: 'center' });
                doc.moveDown(0.5);
                doc.text('Conformément à la loi n° 2004-045 du 14 décembre 2004 portant code du travail au Sénégal', { align: 'center' });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    static async generatePaymentReceipt(paiementData) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);
            doc.fontSize(20).text('REÇU DE PAIEMENT', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Employé: ${paiementData.employe.nom} ${paiementData.employe.prenom}`);
            doc.text(`Montant: ${paiementData.montant}€`);
            doc.text(`Date: ${paiementData.datePaiement}`);
            doc.text(`Mode: ${paiementData.modePaiement}`);
            doc.end();
        });
    }
    static async generatePaymentList(paiements) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);
            doc.fontSize(20).text('LISTE DES PAIEMENTS', { align: 'center' });
            doc.moveDown();
            paiements.forEach((paiement, index) => {
                doc.fontSize(12).text(`${index + 1}. ${paiement.employe.nom} ${paiement.employe.prenom} - ${paiement.montant}€ - ${paiement.datePaiement}`);
            });
            doc.end();
        });
    }
    static async generateRapportPdf(rapport) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);
            // Header
            doc.fontSize(20).text(`RAPPORT - ${rapport.typeRapport}`, { align: 'center' });
            doc.moveDown();
            // Report info
            doc.fontSize(12).text(`Date de génération: ${rapport.dateGeneration ? new Date(rapport.dateGeneration).toLocaleString() : 'N/A'}`);
            doc.moveDown();
            // Content
            if (rapport.contenu) {
                if (typeof rapport.contenu === 'object') {
                    Object.entries(rapport.contenu).forEach(([key, value]) => {
                        doc.text(`${key}: ${JSON.stringify(value, null, 2)}`);
                        doc.moveDown();
                    });
                }
                else {
                    doc.text(String(rapport.contenu));
                }
            }
            doc.end();
        });
    }
}
//# sourceMappingURL=pdfService.js.map