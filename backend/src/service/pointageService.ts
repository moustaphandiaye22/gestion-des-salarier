import { pointageRepository } from '../repositories/pointage.js';
import { pointageSchema } from '../validators/pointage.js';

export class PointageService {
  private pointageRepository: pointageRepository;

  constructor() {
    this.pointageRepository = new pointageRepository();
  }

  async createPointage(data: any) {
    const parsed = pointageSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;

    // Calcul automatique de la durée de travail si les heures d'entrée et sortie sont fournies
    if (data.heureEntree && data.heureSortie) {
      const duree = this.calculateDureeTravail(data.heureEntree, data.heureSortie);
      data.dureeTravail = duree;
    }

    return this.pointageRepository.create(data);
  }

  async getPointage(id: number) {
    return this.pointageRepository.findById(id);
  }

  async getAllPointages(user?: any, entrepriseId?: number) {
    if (user) {
      return this.pointageRepository.findAllByUser(user, entrepriseId);
    }
    return this.pointageRepository.findAll();
  }

  async updatePointage(id: number, data: any) {
    const parsed = pointageSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;

    // Recalcul de la durée si les heures changent
    if (data.heureEntree || data.heureSortie) {
      const currentPointage = await this.pointageRepository.findById(id);
      if (currentPointage) {
        const heureEntree = data.heureEntree || currentPointage.heureEntree;
        const heureSortie = data.heureSortie || currentPointage.heureSortie;

        if (heureEntree && heureSortie) {
          data.dureeTravail = this.calculateDureeTravail(heureEntree, heureSortie);
        }
      }
    }

    return this.pointageRepository.update(id, data);
  }

  async deletePointage(id: number) {
    return this.pointageRepository.delete(id);
  }

  async getPointagesByEmploye(employeId: number) {
    return this.pointageRepository.findByEmployeAndDate(employeId, new Date());
  }

  async getPointagesByEmployeAndPeriode(employeId: number, dateDebut: Date, dateFin: Date) {
    return this.pointageRepository.findByEmployeAndPeriode(employeId, dateDebut, dateFin);
  }

  async getPointagesByEntrepriseAndDate(entrepriseId: number, dateDebut: Date, dateFin: Date) {
    return this.pointageRepository.findByEntrepriseAndDate(entrepriseId, dateDebut, dateFin);
  }

  async getPointagesByType(typePointage: string) {
    return this.pointageRepository.findByType(typePointage as any);
  }

  async getPointagesByStatut(statut: string) {
    return this.pointageRepository.findByStatut(statut as any);
  }

  async calculateHeuresTravaillees(employeId: number, dateDebut: Date, dateFin: Date): Promise<number> {
    return this.pointageRepository.calculateHeuresTravaillees(employeId, dateDebut, dateFin);
  }

  async bulkCreatePointages(pointages: any[]) {
    const results = {
      success: [] as any[],
      errors: [] as { index: number; errors: any[] }[]
    };

    for (let i = 0; i < pointages.length; i++) {
      const data = pointages[i];
      const parsed = pointageSchema.safeParse(data);
      if (!parsed.success) {
        results.errors.push({ index: i, errors: parsed.error.issues });
        continue;
      }

      // Calcul automatique de la durée
      if (data.heureEntree && data.heureSortie) {
        data.dureeTravail = this.calculateDureeTravail(data.heureEntree, data.heureSortie);
      }

      try {
        const created = await this.pointageRepository.create(data);
        results.success.push(created);
      } catch (err) {
        results.errors.push({ index: i, errors: [{ message: (err as Error).message }] });
      }
    }
    return results;
  }

  async getStatistiques(entrepriseId: number, dateDebut: Date, dateFin: Date) {
    return this.pointageRepository.getStatistiques(entrepriseId, dateDebut, dateFin);
  }

  async pointerEntree(employeId: number, entrepriseId: number, lieu?: string, ipAddress?: string, localisation?: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Vérifier s'il y a déjà un pointage d'entrée aujourd'hui
    const existingPointages = await this.pointageRepository.findByEmployeAndDate(employeId, today);

    const pointageData = {
      datePointage: new Date(),
      heureEntree: new Date(),
      typePointage: 'PRESENCE',
      statut: 'PRESENT',
      lieu,
      ipAddress,
      localisation,
      employeId,
      entrepriseId
    };

    return this.pointageRepository.create(pointageData);
  }

  async pointerSortie(employeId: number, entrepriseId: number, lieu?: string, ipAddress?: string, localisation?: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Trouver le pointage d'entrée d'aujourd'hui
    const existingPointages = await this.pointageRepository.findByEmployeAndDate(employeId, today);
    const pointageEntree = existingPointages.find(p => p.heureEntree && !p.heureSortie);

    if (!pointageEntree) {
      throw new Error('Aucun pointage d\'entrée trouvé pour aujourd\'hui');
    }

    const heureSortie = new Date();
    const dureeTravail = this.calculateDureeTravail(pointageEntree.heureEntree, heureSortie);

    return this.pointageRepository.update(pointageEntree.id, {
      heureSortie,
      dureeTravail,
      lieu,
      ipAddress,
      localisation
    });
  }

  private calculateDureeTravail(heureEntree: Date | string, heureSortie: Date | string): number {
    const entree = new Date(heureEntree);
    const sortie = new Date(heureSortie);

    const diffMs = sortie.getTime() - entree.getTime();
    const diffHeures = diffMs / (1000 * 60 * 60);

    // Arrondir à 2 décimales
    return Math.round(diffHeures * 100) / 100;
  }

  async filterPointages(filters: any) {
    if (filters.typePointage) {
      return this.pointageRepository.findByType(filters.typePointage);
    }
    if (filters.statut) {
      return this.pointageRepository.findByStatut(filters.statut);
    }
    if (filters.employeId) {
      const today = new Date();
      return this.pointageRepository.findByEmployeAndDate(filters.employeId, today);
    }
    if (filters.dateDebut && filters.dateFin) {
      return this.pointageRepository.findByEntrepriseAndDate(
        filters.entrepriseId,
        new Date(filters.dateDebut),
        new Date(filters.dateFin)
      );
    }
    return this.pointageRepository.findAll();
  }
}