import { PrismaClient } from '@prisma/client';
import { mnprisma } from '../config/db.js';

export interface AlerteData {
  titre: string;
  message: string;
  type: string;
  severite: string;
  tableauDeBordId: number;
  entrepriseId: number | null;
  utilisateurId?: number;
}

export class AlerteService {
  private prisma = mnprisma;

  /**
   * Crée une nouvelle alerte
   */
  async createAlerte(data: AlerteData) {
    return await (this.prisma as any).alerte.create({
      data: {
        titre: data.titre,
        message: data.message,
        type: data.type as any,
        severite: data.severite as any,
        tableauDeBordId: data.tableauDeBordId,
        entrepriseId: data.entrepriseId,
        utilisateurId: data.utilisateurId,
        estLue: false,
        dateCreation: new Date()
      }
    });
  }

  /**
   * Récupère les alertes non lues pour un tableau de bord
   */
  async getAlertesNonLues(tableauDeBordId: number, entrepriseId: number | null, isSuperAdmin: boolean = false) {
    const whereClause = isSuperAdmin
      ? { tableauDeBordId, estLue: false }
      : { tableauDeBordId, entrepriseId, estLue: false };

    return await (this.prisma as any).alerte.findMany({
      where: whereClause,
      orderBy: {
        dateCreation: 'desc'
      },
      include: {
        utilisateur: {
          select: {
            nom: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Marque une alerte comme lue
   */
  async marquerCommeLue(alerteId: number) {
    return await (this.prisma as any).alerte.update({
      where: { id: alerteId },
      data: {
        estLue: true,
        dateLecture: new Date()
      }
    });
  }

  /**
   * Génère des alertes automatiques basées sur les règles métier
   */
  async genererAlertesAutomatiques(entrepriseId: number | null, tableauDeBordId: number, isSuperAdmin: boolean = false) {
    const alertes: AlerteData[] = [];

    // Construire les conditions de filtrage selon le rôle
    const baseWhere = isSuperAdmin ? {} : { entrepriseId: entrepriseId! };

    // Alerte: Taux de paiement faible
    const paiements = await this.prisma.paiement.findMany({
      where: baseWhere
    });

    const tauxPaiement = paiements.length > 0
      ? (paiements.filter(p => p.statut === 'PAYE').length / paiements.length) * 100
      : 100;

    if (tauxPaiement < 80) {
      alertes.push({
        titre: 'Taux de paiement faible',
        message: `Le taux de paiement est de ${tauxPaiement.toFixed(1)}%, ce qui est inférieur au seuil recommandé de 80%.`,
        type: 'TAUX_PAIEMENT_FAIBLE',
        severite: tauxPaiement < 50 ? 'CRITIQUE' : 'MOYENNE',
        tableauDeBordId,
        entrepriseId: isSuperAdmin ? 1 : entrepriseId, // Entreprise par défaut pour le superadmin
        utilisateurId: 1
      });
    }

    // Alerte: Nombre élevé d'échecs de paiement
    const paiementsEchoues = paiements.filter(p => p.statut === 'ECHEC').length;
    if (paiementsEchoues > 0) {
      alertes.push({
        titre: 'Paiements échoués',
        message: `${paiementsEchoues} paiement(s) ont échoué. Veuillez vérifier les informations de paiement.`,
        type: 'PAIEMENT_ECHEC',
        severite: paiementsEchoues > 5 ? 'CRITIQUE' : 'MOYENNE',
        tableauDeBordId,
        entrepriseId: isSuperAdmin ? 1 : entrepriseId,
        utilisateurId: 1
      });
    }

    // Alerte: Nouveau employé ajouté
    const nouveauxEmployes = await this.prisma.journalAudit.findMany({
      where: {
        ...baseWhere,
        action: 'CREATION',
        employeId: { not: null },
        dateAction: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
        }
      }
    });

    if (nouveauxEmployes.length > 0) {
      alertes.push({
        titre: 'Nouveaux employés',
        message: `${nouveauxEmployes.length} employé(s) ont été ajouté(s) aujourd'hui.`,
        type: 'NOUVEAU_EMPLOYE',
        severite: 'FAIBLE',
        tableauDeBordId,
        entrepriseId: isSuperAdmin ? 1 : entrepriseId,
        utilisateurId: 1
      });
    }

    // Alerte: Licences expirant bientôt
    const licences = await this.prisma.licence.findMany({
      where: {
        ...baseWhere,
        statut: 'ACTIVE',
        dateFin: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Prochains 30 jours
        }
      }
    });

    if (licences.length > 0) {
      alertes.push({
        titre: 'Licences expirant bientôt',
        message: `${licences.length} licence(s) expireront dans les 30 prochains jours.`,
        type: 'LICENCE_EXPIRATION',
        severite: 'ELEVEE',
        tableauDeBordId,
        entrepriseId: isSuperAdmin ? 1 : entrepriseId,
        utilisateurId: 1
      });
    }

    // Créer les alertes en base de données
    for (const alerte of alertes) {
      await this.createAlerte(alerte);
    }

    return alertes;
  }

  /**
   * Nettoie les anciennes alertes lues
   */
  async nettoyerAnciennesAlertes(jours: number = 90) {
    const dateLimite = new Date(Date.now() - jours * 24 * 60 * 60 * 1000);

    return await (this.prisma as any).alerte.deleteMany({
      where: {
        estLue: true,
        dateCreation: {
          lt: dateLimite
        }
      }
    });
  }

  /**
   * Récupère les statistiques des alertes
   */
  async getStatistiquesAlertes(entrepriseId: number | null, isSuperAdmin: boolean = false) {
    const whereClause = isSuperAdmin ? {} : { entrepriseId: entrepriseId! };

    const [total, nonLues, parType, parSeverite] = await Promise.all([
      (this.prisma as any).alerte.count({
        where: whereClause
      }),
      (this.prisma as any).alerte.count({
        where: {
          ...whereClause,
          estLue: false
        }
      }),
      (this.prisma as any).alerte.groupBy({
        by: ['type'],
        where: whereClause,
        _count: { id: true }
      }),
      (this.prisma as any).alerte.groupBy({
        by: ['severite'],
        where: whereClause,
        _count: { id: true }
      })
    ]);

    return {
      total,
      nonLues,
      parType,
      parSeverite
    };
  }
}

export const alerteService = new AlerteService();