import { mnprisma } from '../config/db.js';

export class SalaryCalculationService {

  /**
   * Calculate net salary for an employee based on their salary components and deductions
   * This includes taxes, social security contributions, and other deductions
   */
  async calculateNetSalary(employeeId: number): Promise<number> {
    const employee = await mnprisma.employe.findUnique({
      where: { id: employeeId },
      include: { entreprise: true }
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Get global parameters for calculations
    const globalParams = await mnprisma.parametreGlobal.findMany();
    const taxRate = parseFloat(globalParams.find(p => p.cle === 'TAX_RATE')?.valeur || '0.2'); // 20% default
    const socialSecurityRate = parseFloat(globalParams.find(p => p.cle === 'SOCIAL_SECURITY_RATE')?.valeur || '0.08'); // 8% default

    // Convert Decimal to number for calculations
    const baseSalaryNum = Number(employee.salaireBase);
    const allocationsNum = Number(employee.allocations || 0);
    const deductionsNum = Number(employee.deductions || 0);

    // Base salary calculation
    let baseSalary = baseSalaryNum;

    // For hourly employees, calculate based on standard hours (assuming 160 hours/month)
    if (employee.typeSalaire === 'HONORAIRES' && employee.salaireHoraire) {
      baseSalary = Number(employee.salaireHoraire) * 160; // Standard monthly hours
    }

    // For daily employees, calculate based on working days (assuming 22 days/month)
    if (employee.typeSalaire === 'JOURNALIER' && employee.tauxJournalier) {
      baseSalary = Number(employee.tauxJournalier) * 22; // Standard working days
    }

    // Add allocations
    const allocations = allocationsNum;

    // Calculate deductions
    const manualDeductions = deductionsNum;

    // Calculate automatic deductions
    const grossSalary = baseSalary + allocations;
    const taxDeduction = grossSalary * taxRate;
    const socialSecurityDeduction = grossSalary * socialSecurityRate;

    // Total deductions
    const totalDeductions = manualDeductions + taxDeduction + socialSecurityDeduction;

    // Net salary
    const netSalary = grossSalary - totalDeductions;

    return Math.max(0, netSalary); // Ensure non-negative
  }

  /**
   * Get the most recent bulletin for an employee
   */
  async getLatestBulletin(employeeId: number) {
    return await mnprisma.bulletin.findFirst({
      where: { employeId: employeeId },
      include: {
        employe: true,
        cycle: true,
        paiements: true
      },
      orderBy: { dateGeneration: 'desc' } as any
    });
  }

  /**
   * Generate a unique payment reference
   */
  generatePaymentReference(employeeId: number, date: Date = new Date()): string {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    return `PAY-${employeeId}-${dateStr}-${timestamp}`;
  }

  /**
   * Get employee payment information for payment creation
   */
  async getEmployeePaymentInfo(employeeId: number) {
    const employee = await mnprisma.employe.findUnique({
      where: { id: employeeId },
      include: {
        entreprise: {
          include: {
            cyclesPaie: {
              where: { statut: 'OUVERT' },
              orderBy: { createdAt: 'desc' } as any,
              take: 1
            }
          }
        }
      }
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Get latest bulletin
    const latestBulletin = await this.getLatestBulletin(employeeId);

    // Get current open pay cycle
    const currentCycle = employee.entreprise?.cyclesPaie?.[0];

    return {
      employee,
      entreprise: employee.entreprise,
      latestBulletin,
      currentCycle,
      netSalary: latestBulletin ? latestBulletin.totalAPayer : await this.calculateNetSalary(employeeId)
    };
  }

  /**
   * Validate if payment can be made based on pay cycle
   */
  async validatePaymentCycle(employeeId: number, paymentDate: Date): Promise<boolean> {
    const employee = await mnprisma.employe.findUnique({
      where: { id: employeeId },
      include: {
        entreprise: {
          include: {
            cyclesPaie: {
              where: { statut: 'OUVERT' }
            }
          }
        }
      }
    });

    if (!employee || !employee.entreprise?.cyclesPaie?.length) {
      return false;
    }

    const currentCycle = employee.entreprise.cyclesPaie[0];

    // Check if payment date is within the cycle period
    return currentCycle ? (paymentDate >= currentCycle.dateDebut && paymentDate <= currentCycle.dateFin) : false;
  }
}
