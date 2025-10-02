import * as XLSX from 'xlsx';
import { bulletinRepository } from '../repositories/bulletin.js';
import { paiementRepository } from '../repositories/paiement.js';

export class ExportService {
  private bulletinRepository: bulletinRepository;
  private paiementRepository: paiementRepository;

  constructor() {
    this.bulletinRepository = new bulletinRepository();
    this.paiementRepository = new paiementRepository();
  }

  /**
   * Export bulletins to Excel format
   */
  async exportBulletinsToExcel(user?: any): Promise<Buffer> {
    const bulletins = await this.bulletinRepository.findAllByUser(user);

    const data = [
      [
        'Numéro Bulletin',
        'Employé ID',
        'Période Début',
        'Période Fin',
        'Salaire Base',
        'Allocations',
        'Déductions',
        'Total à Payer',
        'Statut Paiement',
        'Date Génération'
      ]
    ];

    bulletins.forEach(bulletin => {
      data.push([
        bulletin.numeroBulletin || '',
        bulletin.employeId?.toString() || '',
        bulletin.periodeDebut ? new Date(bulletin.periodeDebut).toLocaleDateString() : '',
        bulletin.periodeFin ? new Date(bulletin.periodeFin).toLocaleDateString() : '',
        bulletin.salaireBase?.toString() || '0',
        bulletin.allocations?.toString() || '0',
        bulletin.deductions?.toString() || '0',
        bulletin.totalAPayer?.toString() || '0',
        bulletin.statutPaiement || '',
        bulletin.dateGeneration ? new Date(bulletin.dateGeneration).toLocaleDateString() : ''
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Bulletins');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }

  /**
   * Export payments to Excel format
   */
  async exportPaiementsToExcel(user?: any): Promise<Buffer> {
    const paiements = await this.paiementRepository.findAllByUser(user);

    const data = [
      [
        'Référence',
        'Bulletin ID',
        'Entreprise ID',
        'Montant',
        'Mode Paiement',
        'Date Paiement',
        'Statut'
      ]
    ];

    paiements.forEach(paiement => {
      data.push([
        paiement.reference || '',
        paiement.bulletinId?.toString() || '',
        paiement.entrepriseId?.toString() || '',
        paiement.montant?.toString() || '0',
        paiement.modePaiement || '',
        paiement.datePaiement ? new Date(paiement.datePaiement).toLocaleDateString() : '',
        paiement.statut || ''
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Paiements');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }

  /**
   * Export employee template to Excel format
   */
  async exportEmployeeTemplate(): Promise<Buffer> {
    const data = [
      [
        'matricule',
        'nom',
        'prenom',
        'email',
        'telephone',
        'adresse',
        'dateEmbauche',
        'statutEmploi',
        'typeContrat',
        'salaireBase',
        'allocations',
        'deductions',
        'entrepriseId'
      ],
      [
        'EMP001',
        'Dupont',
        'Jean',
        'jean.dupont@example.com',
        '0123456789',
        '123 Rue de la Paix, Paris',
        '2023-01-15',
        'ACTIF',
        'CDI',
        '250000',
        '50000',
        '20000',
        '1'
      ]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Modele Employes');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }
}
