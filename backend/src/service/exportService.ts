import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

export interface ExportRequest {
  type: string;
  format: string;
  parametres: any;
  utilisateurId: number;
  entrepriseId: number | null;
}

export class ExportService {
  private prisma = mnprisma;
  private exportDir = path.join(process.cwd(), 'exports');

  constructor() {
    // Créer le dossier d'exports s'il n'existe pas
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  /**
   * Lance une nouvelle exportation
   */
  async createExport(request: ExportRequest) {
    // Créer l'enregistrement d'export
    const exportRecord = await (this.prisma as any).export.create({
      data: {
        nom: `Export_${request.type}_${new Date().toISOString().split('T')[0]}`,
        type: request.type as any,
        format: request.format as any,
        statut: 'EN_COURS',
        parametres: request.parametres,
        utilisateurId: request.utilisateurId,
        entrepriseId: request.entrepriseId,
        dateCreation: new Date()
      }
    });

    // Lancer l'export en arrière-plan
    this.processExport(exportRecord.id).catch(console.error);

    return exportRecord;
  }

  /**
   * Traite l'export de manière asynchrone
   */
  private async processExport(exportId: number) {
    try {
      // Use the existing mnprisma instance instead of this.prisma for new models
      const exportRecord = await (this.prisma as any).export.findUnique({
        where: { id: exportId }
      });

      if (!exportRecord) return;

      let filePath: string;
      let fileName: string;

      switch (exportRecord.type) {
        case 'DONNEES_ANALYTIQUES':
          ({ filePath, fileName } = await this.exportDonneesAnalytiques(exportRecord));
          break;
        case 'RAPPORT_SALARIAL':
          ({ filePath, fileName } = await this.exportRapportSalarial(exportRecord));
          break;
        case 'LISTE_EMPLOYES':
          ({ filePath, fileName } = await this.exportListeEmployes(exportRecord));
          break;
        case 'BULLETINS_PAIE':
          ({ filePath, fileName } = await this.exportBulletinsPaie(exportRecord));
          break;
        case 'PAIEMENTS':
          ({ filePath, fileName } = await this.exportPaiements(exportRecord));
          break;
        case 'KPI_DASHBOARD':
          ({ filePath, fileName } = await this.exportKpiDashboard(exportRecord));
          break;
        default:
          throw new Error(`Type d'export non supporté: ${exportRecord.type}`);
      }

      // Mettre à jour le statut de l'export
      await (this.prisma as any).export.update({
        where: { id: exportId },
        data: {
          statut: 'TERMINE',
          cheminFichier: filePath,
          dateFin: new Date()
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);

      // Mettre à jour le statut d'erreur
      await (this.prisma as any).export.update({
        where: { id: exportId },
        data: {
          statut: 'ECHEC',
          dateFin: new Date()
        }
      });
    }
  }

  /**
   * Export des données analytiques
   */
  private async exportDonneesAnalytiques(exportRecord: any) {
    const { entrepriseId, parametres } = exportRecord;
    const { dateDebut, dateFin } = parametres;
    const isSuperAdmin = entrepriseId === null;

    const [employes, bulletins, paiements] = await Promise.all([
      this.prisma.employe.findMany({
        where: {
          ...(isSuperAdmin ? {} : { entrepriseId }),
          estActif: true
        }
      }),
      this.prisma.bulletin.findMany({
        where: {
          employe: isSuperAdmin ? {} : { entrepriseId },
          ...(dateDebut && dateFin && {
            dateGeneration: {
              gte: new Date(dateDebut),
              lte: new Date(dateFin)
            }
          })
        }
      }),
      this.prisma.paiement.findMany({
        where: isSuperAdmin ? {} : { entrepriseId }
      })
    ]);

    const data = {
      resume: {
        nombreEmployes: employes.length,
        nombreBulletins: bulletins.length,
        nombrePaiements: paiements.length,
        totalSalaire: bulletins.reduce((sum, b) => sum + Number(b.totalAPayer), 0)
      },
      employes: employes.map(e => ({
        matricule: e.matricule,
        nom: `${e.prenom} ${e.nom}`,
        salaireBase: e.salaireBase,
        statut: e.statutEmploi
      })),
      bulletins: bulletins.map(b => ({
        numero: b.numeroBulletin,
        employe: 'Employee data not included in this export',
        periode: `${b.periodeDebut.toISOString().split('T')[0]} - ${b.periodeFin.toISOString().split('T')[0]}`,
        totalAPayer: b.totalAPayer
      }))
    };

    return this.saveDataToFile(data, exportRecord, 'donnees-analytiques');
  }

  /**
   * Export du rapport salarial
   */
  private async exportRapportSalarial(exportRecord: any) {
    const { entrepriseId, parametres } = exportRecord;
    const { mois, annee } = parametres;
    const isSuperAdmin = entrepriseId === null;

    const bulletins = await this.prisma.bulletin.findMany({
      where: {
        employe: isSuperAdmin ? {} : { entrepriseId },
        periodeDebut: {
          gte: new Date(annee, mois - 1, 1),
          lt: new Date(annee, mois, 1)
        }
      },
      include: { employe: true }
    });

    const data = {
      periode: `${mois}/${annee}`,
      statistiques: {
        nombreBulletins: bulletins.length,
        totalBrut: bulletins.reduce((sum, b) => sum + Number(b.salaireBase), 0),
        totalAllocations: bulletins.reduce((sum, b) => sum + Number(b.allocations), 0),
        totalDeductions: bulletins.reduce((sum, b) => sum + Number(b.deductions), 0),
        totalNet: bulletins.reduce((sum, b) => sum + Number(b.totalAPayer), 0)
      },
      bulletins: bulletins.map(b => ({
        employe: `${b.employe.prenom} ${b.employe.nom}`,
        matricule: b.employe.matricule,
        salaireBase: b.salaireBase,
        allocations: b.allocations,
        deductions: b.deductions,
        netAPayer: b.totalAPayer
      }))
    };

    return this.saveDataToFile(data, exportRecord, 'rapport-salarial');
  }

  /**
   * Export de la liste des employés
   */
  private async exportListeEmployes(exportRecord: any) {
    const { entrepriseId } = exportRecord;

    const employes = await this.prisma.employe.findMany({
      where: { entrepriseId },
      include: { profession: true }
    });

    const data = employes.map(e => ({
      matricule: e.matricule,
      nom: `${e.prenom} ${e.nom}`,
      email: e.email,
      telephone: e.telephone,
      dateEmbauche: e.dateEmbauche.toISOString().split('T')[0],
      statutEmploi: e.statutEmploi,
      typeContrat: e.typeContrat,
      salaireBase: e.salaireBase,
      profession: e.profession?.nom || ''
    }));

    return this.saveDataToFile(data, exportRecord, 'liste-employes');
  }

  /**
   * Export des bulletins de paie
   */
  private async exportBulletinsPaie(exportRecord: any) {
    const { entrepriseId, parametres } = exportRecord;
    const { dateDebut, dateFin } = parametres;

    const bulletins = await this.prisma.bulletin.findMany({
      where: {
        employe: { entrepriseId },
        ...(dateDebut && dateFin && {
          dateGeneration: {
            gte: new Date(dateDebut),
            lte: new Date(dateFin)
          }
        })
      },
      include: { employe: true }
    });

    const data = bulletins.map(b => ({
      numero: b.numeroBulletin,
      employe: `${b.employe.prenom} ${b.employe.nom}`,
      matricule: b.employe.matricule,
      periode: `${b.periodeDebut.toISOString().split('T')[0]} - ${b.periodeFin.toISOString().split('T')[0]}`,
      salaireBase: b.salaireBase,
      allocations: b.allocations,
      deductions: b.deductions,
      totalAPayer: b.totalAPayer,
      statut: b.statutPaiement
    }));

    return this.saveDataToFile(data, exportRecord, 'bulletins-paie');
  }

  /**
   * Export des paiements
   */
  private async exportPaiements(exportRecord: any) {
    const { entrepriseId, parametres } = exportRecord;
    const { dateDebut, dateFin } = parametres;

    const paiements = await this.prisma.paiement.findMany({
      where: {
        entrepriseId,
        ...(dateDebut && dateFin && {
          datePaiement: {
            gte: new Date(dateDebut),
            lte: new Date(dateFin)
          }
        })
      },
      include: { bulletin: { include: { employe: true } } }
    });

    const data = paiements.map(p => ({
      reference: p.reference,
      employe: p.bulletin.employe ? `${p.bulletin.employe.prenom} ${p.bulletin.employe.nom}` : '',
      matricule: p.bulletin.employe?.matricule || '',
      montant: p.montant,
      modePaiement: p.modePaiement,
      statut: p.statut,
      datePaiement: p.datePaiement.toISOString().split('T')[0]
    }));

    return this.saveDataToFile(data, exportRecord, 'paiements');
  }

  /**
   * Export des KPIs du dashboard
   */
  private async exportKpiDashboard(exportRecord: any) {
    const { entrepriseId } = exportRecord;

    const kpis = await (this.prisma as any).kpiData.findMany({
      where: {
        entrepriseId,
        dateCalcul: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 derniers jours
        }
      },
      orderBy: {
        dateCalcul: 'desc'
      }
    });

    const data = {
      generatedAt: new Date().toISOString(),
      kpis: kpis.map((k: any) => ({
        nom: k.nom,
        valeur: k.valeur,
        unite: k.unite,
        typeKpi: k.typeKpi,
        periode: k.periode,
        dateCalcul: k.dateCalcul.toISOString()
      }))
    };

    return this.saveDataToFile(data, exportRecord, 'kpi-dashboard');
  }

  /**
   * Sauvegarde les données dans un fichier selon le format demandé
   */
  private async saveDataToFile(data: any, exportRecord: any, typeName: string): Promise<{ filePath: string; fileName: string }> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${typeName}-${timestamp}`;

    let filePath: string;
    let fullPath: string;

    switch (exportRecord.format) {
      case 'EXCEL':
        filePath = `${fileName}.xlsx`;
        fullPath = path.join(this.exportDir, filePath);

        const worksheet = XLSX.utils.json_to_sheet(Array.isArray(data) ? data : [data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, typeName);
        XLSX.writeFile(workbook, fullPath);
        break;

      case 'CSV':
        filePath = `${fileName}.csv`;
        fullPath = path.join(this.exportDir, filePath);

        const csvContent = this.jsonToCsv(data);
        fs.writeFileSync(fullPath, csvContent, 'utf8');
        break;

      case 'JSON':
        filePath = `${fileName}.json`;
        fullPath = path.join(this.exportDir, filePath);

        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
        break;

      case 'PDF':
        filePath = `${fileName}.pdf`;
        fullPath = path.join(this.exportDir, filePath);

        await this.generatePDF(data, fullPath, typeName);
        break;

      default:
        throw new Error(`Format d'export non supporté: ${exportRecord.format}`);
    }

    return { filePath, fileName };
  }

  /**
   * Convertit un objet JSON en CSV
   */
  private jsonToCsv(data: any): string {
    if (!Array.isArray(data) || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  }

  /**
   * Génère un PDF à partir des données
   */
  private async generatePDF(data: any, filePath: string, title: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument() as any;
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(18).text(title, { align: 'center' });
      doc.moveDown();

      if (Array.isArray(data)) {
        data.forEach((item: any, index: number) => {
          doc.fontSize(12).text(`${index + 1}. ${JSON.stringify(item)}`);
          doc.moveDown(0.5);
        });
      } else {
        doc.fontSize(12).text(JSON.stringify(data, null, 2));
      }

      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  /**
   * Récupère la liste des exports pour un utilisateur
   */
  async getExportsUtilisateur(utilisateurId: number, entrepriseId: number | null, isSuperAdmin: boolean = false) {
    return await (this.prisma as any).export.findMany({
      where: {
        utilisateurId,
        ...(isSuperAdmin ? {} : { entrepriseId })
      },
      orderBy: {
        dateCreation: 'desc'
      }
    });
  }

  /**
   * Télécharge un fichier d'export
   */
  async downloadExport(exportId: number, utilisateurId: number) {
    const exportRecord = await (this.prisma as any).export.findFirst({
      where: {
        id: exportId,
        utilisateurId,
        statut: 'TERMINE'
      }
    });

    if (!exportRecord || !exportRecord.cheminFichier) {
      throw new Error('Export non trouvé ou non terminé');
    }

    const fullPath = path.join(this.exportDir, exportRecord.cheminFichier);

    if (!fs.existsSync(fullPath)) {
      throw new Error('Fichier d\'export introuvable');
    }

    return {
      filePath: fullPath,
      fileName: exportRecord.cheminFichier,
      mimeType: this.getMimeType(exportRecord.format)
    };
  }

  /**
   * Récupère le type MIME selon le format
   */
  private getMimeType(format: string): string {
    switch (format) {
      case 'PDF': return 'application/pdf';
      case 'EXCEL': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'CSV': return 'text/csv';
      case 'JSON': return 'application/json';
      default: return 'application/octet-stream';
    }
  }
}

export const exportService = new ExportService();