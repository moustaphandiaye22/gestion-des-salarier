import type { TypeCyclePaie } from '@prisma/client';
import { cyclePaieRepository } from '../repositories/cyclePaie.js';
import { cyclePaieSchema } from '../validators/cyclePaie.js';
import { StatutCyclePaie } from '@prisma/client';

// Import the enum for validation status
import { StatutValidationCycle } from '@prisma/client';
import { BulletinService } from './bulletinService.js';
import { SalaryCalculationService } from './salaryCalculationService.js';
import { mnprisma } from '../config/db.js';

export class CyclePaieService {

    private  cyclePaieRepository : cyclePaieRepository
    private bulletinService: BulletinService
    private salaryCalculationService: SalaryCalculationService

    constructor (){
        this.cyclePaieRepository = new cyclePaieRepository()
        this.bulletinService = new BulletinService()
        this.salaryCalculationService = new SalaryCalculationService()
    }

  async createCyclePaie(data: any) {
    const parsed = cyclePaieSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;

    // Create the cycle first
    const cycle = await this.cyclePaieRepository.create(data);

    // Generate bulletins for all active employees in the enterprise
    try {
      await this.generateBulletinsForCycle(cycle.id);
    } catch (error) {
      // If bulletin generation fails, we should still return the cycle
      // but log the error for monitoring
      console.error('Failed to generate bulletins for cycle:', cycle.id, error);
    }

    return cycle;
  }

  async getCyclePaie(id: number) {
   return await this.cyclePaieRepository.findById(id);
  }

  async getAllCyclesPaie(user?: any) {
    if (user) {
      return this.cyclePaieRepository.findAllByUser(user);
    }
    return this.cyclePaieRepository.findAll();
  }

  async updateCyclePaie(id: number, data: any) {
    const parsed = cyclePaieSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
   return await this.cyclePaieRepository.update(id, data);
  }

  async deleteCyclePaie(id: number) {
   return await this.cyclePaieRepository.delete(id);
  }

  async setStatut(id: number, statut: StatutCyclePaie ){
   return await this.cyclePaieRepository.setStatut(id, statut);
  }

  async validateCyclePaie(id: number, user: any) {
    // Only ADMIN_ENTREPRISE can validate cycles
    if (user.profil !== 'ADMIN_ENTREPRISE' && user.profil !== 'SUPER_ADMIN') {
      throw new Error('Seul l\'administrateur d\'entreprise peut valider un cycle de paie');
    }

    const cycle = await this.getCyclePaie(id);
    if (!cycle) {
      throw new Error('Cycle de paie non trouvé');
    }

    // Cast cycle to include statutValidation property
    const cycleWithValidation = cycle as unknown as { statutValidation: StatutValidationCycle };

    if (cycleWithValidation.statutValidation !== StatutValidationCycle.BROUILLON) {
      throw new Error('Le cycle de paie n\'est pas en état BROUILLON');
    }

    return await this.cyclePaieRepository.setStatutValidation(id, StatutValidationCycle.VALIDE);
  }

  async closeCyclePaie(id: number, user: any) {
    // Only ADMIN_ENTREPRISE can close cycles
    if (user.profil !== 'ADMIN_ENTREPRISE' && user.profil !== 'SUPER_ADMIN') {
      throw new Error('Seul l\'administrateur d\'entreprise peut clôturer un cycle de paie');
    }

    const cycle = await this.getCyclePaie(id);
    if (!cycle) {
      throw new Error('Cycle de paie non trouvé');
    }

    // Cast cycle to include statutValidation property
    const cycleWithValidation = cycle as unknown as { statutValidation: StatutValidationCycle };

    if (cycleWithValidation.statutValidation !== StatutValidationCycle.VALIDE) {
      throw new Error('Le cycle de paie doit être validé avant de pouvoir être clôturé');
    }

    // Check if all payments are completed
    const bulletins = await this.cyclePaieRepository.getBulletinsByCycleId(id);
    const allPaid = bulletins.every(bulletin => bulletin.statutPaiement === 'PAYE');

    if (!allPaid) {
      throw new Error('Tous les paiements doivent être effectués avant de clôturer le cycle');
    }

    return await this.cyclePaieRepository.setStatutValidation(id, StatutValidationCycle.CLOTURE);
  }

  async generateBulletinsForCycle(cycleId: number): Promise<void> {
    // Get the cycle with enterprise information
    const cycle = await this.cyclePaieRepository.findById(cycleId);
    if (!cycle) {
      throw new Error('Cycle de paie non trouvé');
    }

    // Get all active employees for this enterprise
    const employees = await mnprisma.employe.findMany({
      where: {
        entrepriseId: cycle.entrepriseId,
        estActif: true
      }
    });

    // Generate bulletin for each employee
    for (const employee of employees) {
      try {
        // Calculate net salary for the employee
        const netSalary = await this.salaryCalculationService.calculateNetSalary(employee.id);

        // Generate unique bulletin number
        const bulletinNumber = `BUL-${cycleId}-${employee.id}-${Date.now()}`;

        // Create bulletin data
        const bulletinData = {
          numeroBulletin: bulletinNumber,
          periodeDebut: cycle.dateDebut,
          periodeFin: cycle.dateFin,
          salaireBase: employee.salaireBase,
          allocations: employee.allocations || 0,
          deductions: employee.deductions || 0,
          totalAPayer: netSalary,
          cycleId: cycleId,
          employeId: employee.id
        };

        // Create the bulletin
        await this.bulletinService.createBulletin(bulletinData);
      } catch (error) {
        console.error(`Failed to generate bulletin for employee ${employee.id}:`, error);
        // Continue with other employees even if one fails
      }
    }
  }

  async canCashierPayCycle(id: number, user: any) {
    // Only CAISSIER can check this
    if (user.profil !== 'CAISSIER') {
      return false;
    }

    const cycle = await this.getCyclePaie(id);
    if (!cycle) {
      return false;
    }

    // Cast cycle to include statutValidation property
    const cycleWithValidation = cycle as unknown as { statutValidation: StatutValidationCycle };

    // Cashier can only pay validated cycles
    return cycleWithValidation.statutValidation === StatutValidationCycle.VALIDE;
  }
}




