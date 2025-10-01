import type { Request, Response } from 'express';
import { Router } from 'express';
import { kpiService } from '../service/kpiService.js';
import { alerteService } from '../service/alerteService.js';
import { exportService } from '../service/exportService.js';
import { websocketService } from '../service/websocketService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/rbacMiddleware.js';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * Middleware de validation des paramètres de route
 */
const validateRouteParams = (req: Request, res: Response, next: any) => {
  const errors: string[] = [];

  if (!req.params.entrepriseId || isNaN(parseInt(req.params.entrepriseId))) {
    errors.push('entrepriseId doit être un nombre valide');
  }

  if (req.params.tableauDeBordId && isNaN(parseInt(req.params.tableauDeBordId))) {
    errors.push('tableauDeBordId doit être un nombre valide');
  }

  if (req.params.alerteId && isNaN(parseInt(req.params.alerteId))) {
    errors.push('alerteId doit être un nombre valide');
  }

  if (req.params.exportId && isNaN(parseInt(req.params.exportId))) {
    errors.push('exportId doit être un nombre valide');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    });
  }

  next();
};

/**
 * GET /api/dashboard/kpis/:entrepriseId/:tableauDeBordId
 * Récupère tous les KPIs pour un tableau de bord
 */
router.get('/kpis/:entrepriseId/:tableauDeBordId', validateRouteParams, async (req: Request, res: Response) => {
  try {
    const { entrepriseId, tableauDeBordId } = req.params;
    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const kpis = await kpiService.calculateAllKPIs(
      isSuperAdmin ? null : parseInt(entrepriseId!),
      parseInt(tableauDeBordId!),
      isSuperAdmin
    );

    res.json({
      success: true,
      data: kpis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des KPIs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dashboard/evolution/:entrepriseId/:typeKpi
 * Récupère les données d'évolution sur 6 mois pour un KPI spécifique
 */
router.get('/evolution/:entrepriseId/:typeKpi', async (req: Request, res: Response) => {
  try {
    const { entrepriseId, typeKpi } = req.params;
    const { months = '6' } = req.query;
    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const evolutionData = await kpiService.getEvolutionData(
      isSuperAdmin ? 0 : parseInt(entrepriseId!), // 0 pour indiquer toutes les entreprises
      typeKpi!,
      parseInt(months as string)
    );

    res.json({
      success: true,
      data: evolutionData,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données d\'évolution:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dashboard/compare-periods
 * Compare les données entre deux périodes
 */
router.post('/compare-periods', async (req: Request, res: Response) => {
  try {
    const { entrepriseId, typeKpi, period1Start, period1End, period2Start, period2End } = req.body;

    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const comparison = await kpiService.comparePeriods(
      isSuperAdmin ? 0 : parseInt(entrepriseId!), // 0 pour indiquer toutes les entreprises
      typeKpi!,
      new Date(period1Start),
      new Date(period1End),
      new Date(period2Start),
      new Date(period2End)
    );

    res.json({
      success: true,
      data: comparison,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la comparaison des périodes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dashboard/alerts/:entrepriseId/:tableauDeBordId
 * Récupère les alertes non lues pour un tableau de bord
 */
router.get('/alerts/:entrepriseId/:tableauDeBordId', async (req: Request, res: Response) => {
  try {
    const { entrepriseId, tableauDeBordId } = req.params;
    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const alertes = await alerteService.getAlertesNonLues(
      parseInt(tableauDeBordId!),
      isSuperAdmin ? null : parseInt(entrepriseId!),
      isSuperAdmin
    );

    res.json({
      success: true,
      data: alertes,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des alertes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/dashboard/alerts/:alerteId/read
 * Marque une alerte comme lue
 */
router.put('/alerts/:alerteId/read', async (req: Request, res: Response) => {
  try {
    const { alerteId } = req.params;

    const alerte = await alerteService.marquerCommeLue(parseInt(alerteId!));

    res.json({
      success: true,
      data: alerte,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors du marquage de l\'alerte:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dashboard/alerts/generate/:entrepriseId/:tableauDeBordId
 * Génère automatiquement les alertes pour un tableau de bord
 */
router.post('/alerts/generate/:entrepriseId/:tableauDeBordId', async (req: Request, res: Response) => {
  try {
    const { entrepriseId, tableauDeBordId } = req.params;

    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const alertes = await alerteService.genererAlertesAutomatiques(
      isSuperAdmin ? null : parseInt(entrepriseId!),
      parseInt(tableauDeBordId!),
      isSuperAdmin
    );

    res.json({
      success: true,
      data: alertes,
      count: alertes.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la génération des alertes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dashboard/alerts/statistics/:entrepriseId
 * Récupère les statistiques des alertes
 */
router.get('/alerts/statistics/:entrepriseId', async (req: Request, res: Response) => {
  try {
    const { entrepriseId } = req.params;

    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const statistiques = await alerteService.getStatistiquesAlertes(
      isSuperAdmin ? null : parseInt(entrepriseId!),
      isSuperAdmin
    );

    res.json({
      success: true,
      data: statistiques,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dashboard/export
 * Lance une nouvelle exportation
 */
router.post('/export', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const exportRequest = {
      type: req.body.type,
      format: req.body.format,
      parametres: req.body.parametres,
      utilisateurId: user.id,
      entrepriseId: isSuperAdmin ? null : user.entrepriseId
    };

    const exportRecord = await exportService.createExport(exportRequest);

    res.json({
      success: true,
      data: exportRecord,
      message: 'Export lancé avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors du lancement de l\'export:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dashboard/exports
 * Récupère la liste des exports de l'utilisateur
 */
router.get('/exports', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const exports = await exportService.getExportsUtilisateur(
      user.id,
      isSuperAdmin ? null : user.entrepriseId,
      isSuperAdmin
    );

    res.json({
      success: true,
      data: exports,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des exports:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dashboard/exports/:exportId/download
 * Télécharge un fichier d'export
 */
router.get('/exports/:exportId/download', async (req: Request, res: Response) => {
  try {
    const { exportId } = req.params;
    const utilisateurId = (req as any).user.id;

    const fileInfo = await exportService.downloadExport(parseInt(exportId!), utilisateurId);

    res.download(fileInfo.filePath, fileInfo.fileName, {
      headers: {
        'Content-Type': fileInfo.mimeType
      }
    });
  } catch (error: any) {
    console.error('Erreur lors du téléchargement:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dashboard/websocket/stats
 * Récupère les statistiques des connexions WebSocket (admin seulement)
 */
router.get('/websocket/stats', requireRole(['SUPER_ADMIN', 'ADMIN_ENTREPRISE']), async (req: Request, res: Response) => {
  try {
    const stats = websocketService.getConnectionStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques WebSocket:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dashboard/summary/:entrepriseId
 * Récupère un résumé complet du dashboard
 */
router.get('/summary/:entrepriseId', async (req: Request, res: Response) => {
  try {
    const { entrepriseId } = req.params;
    const { tableauDeBordId } = req.query;
    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    if (!tableauDeBordId) {
      return res.status(400).json({
        success: false,
        error: 'tableauDeBordId est requis'
      });
    }

    // Récupérer les KPIs
    const kpis = await kpiService.calculateAllKPIs(
      isSuperAdmin ? null : parseInt(entrepriseId!),
      parseInt(tableauDeBordId as string),
      isSuperAdmin
    );

    // Récupérer les alertes
    const alertes = await alerteService.getAlertesNonLues(
      parseInt(tableauDeBordId as string),
      isSuperAdmin ? null : parseInt(entrepriseId!),
      isSuperAdmin
    );

    // Récupérer les données d'évolution pour les graphiques principaux
    const evolutionPromises = [
      kpiService.getEvolutionData(isSuperAdmin ? 0 : parseInt(entrepriseId!), 'MASSE_SALARIALE', 6),
      kpiService.getEvolutionData(isSuperAdmin ? 0 : parseInt(entrepriseId!), 'NOMBRE_EMPLOYES', 6),
      kpiService.getEvolutionData(isSuperAdmin ? 0 : parseInt(entrepriseId!), 'TAUX_PAIEMENT', 6)
    ];

    const [masseSalarialeEvolution, employesEvolution, paiementEvolution] = await Promise.all(evolutionPromises);

    res.json({
      success: true,
      data: {
        kpis,
        alertes,
        evolution: {
          masseSalariale: masseSalarialeEvolution,
          employes: employesEvolution,
          paiements: paiementEvolution
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du résumé:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;