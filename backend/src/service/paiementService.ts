import type { StatutPaiement } from '@prisma/client';
import { paiementRepository } from '../repositories/paiement.js';
import { bulletinRepository } from '../repositories/bulletin.js';
import { SalaryCalculationService } from './salaryCalculationService.js';
import { BulletinService } from './bulletinService.js';
import { paiementSchema } from '../validators/paiement.js';
import { mnprisma } from '../config/db.js';

export class PaiementService {

    private paiementRepository : paiementRepository
    private bulletinRepository : bulletinRepository
    private salaryCalculationService : SalaryCalculationService
    private bulletinService : BulletinService

    constructor (){
        this.paiementRepository = new paiementRepository()
        this.bulletinRepository = new bulletinRepository()
        this.salaryCalculationService = new SalaryCalculationService()
        this.bulletinService = new BulletinService()
    }

  async createPaiement(data: any) {
    const parsed = paiementSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;

    const { employeId, cycleId, entrepriseId, ...paymentData } = data;

    // Check if a bulletin already exists for this employee in this cycle
    let bulletin = await this.bulletinRepository.findByEmployeeAndCycle(employeId, cycleId);

    if (!bulletin) {
      // Get employee and cycle information
      const employee = await mnprisma.employe.findUnique({
        where: { id: employeId },
        include: { entreprise: true }
      });

      const cycle = await mnprisma.cyclePaie.findUnique({
        where: { id: cycleId }
      });

      if (!employee || !cycle) {
        throw new Error('Employé ou cycle de paie non trouvé');
      }

      // Calculate salary
      const netSalary = await this.salaryCalculationService.calculateNetSalary(employeId);

      // Generate bulletin number
      const numeroBulletin = `BUL-${employeId}-${cycleId}-${Date.now()}`;

      // Create bulletin data
      const bulletinData = {
        numeroBulletin,
        periodeDebut: cycle.dateDebut,
        periodeFin: cycle.dateFin,
        salaireBase: Number(employee.salaireBase),
        allocations: Number(employee.allocations || 0),
        deductions: Number(employee.deductions || 0),
        totalAPayer: netSalary,
        cycleId,
        employeId,
        utilisateurId: data.utilisateurId || null // Add user ID if available
      };

      // Create the bulletin
      bulletin = await this.bulletinService.createBulletin(bulletinData);
    }

    // Create the payment with the bulletin ID and amount
    const paymentWithBulletinId = {
      ...paymentData,
      montant: bulletin.totalAPayer,
      bulletinId: bulletin.id,
      entrepriseId
    };

    return await this.paiementRepository.create(paymentWithBulletinId);
  }

  async getPaiement(id: number) {
   return await this.paiementRepository.findById(id);
  }

  async getAllPaiements(user?: any) {
    if (user) {
      return this.paiementRepository.findAllByUser(user);
    }
    return this.paiementRepository.findAll();
  }

  async updatePaiement(id: number, data: any) {
    const parsed = paiementSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;

    const updatedPaiement = await this.paiementRepository.update(id, data);

    // If the payment status was changed to PAYE, check if all payments for the bulletin are now PAYE
    if (data.statut === 'PAYE') {
      const bulletin = await this.bulletinRepository.findById(updatedPaiement.bulletinId);
      if (bulletin) {
        const allPayments = await this.paiementRepository.findByBulletin(bulletin.id);
        const allPaymentsPaye = allPayments.every(p => p.statut === 'PAYE');

        if (allPaymentsPaye && bulletin.statutPaiement !== 'PAYE') {
          await this.bulletinRepository.setStatutPaiement(bulletin.id, 'PAYE');
        }
      }
    }

    return updatedPaiement;
  }

  async deletePaiement(id: number) {
   return await this.paiementRepository.delete(id);
  }

  async setStatut(id: number, statut: StatutPaiement) {
   return await this.paiementRepository.setStatut(id, statut);
  }
}
