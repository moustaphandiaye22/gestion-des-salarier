import { Router } from 'express';
import { PointageController } from '../controller/pointageController.js';
import { requireAdminOrSuper, requireReadAccess } from '../middleware/rbacMiddleware.js';
const router = Router();
const pointageController = new PointageController();
// Créer un pointage - admin entreprise ou super admin
router.post('/', requireAdminOrSuper, pointageController.create);
// Import en lot - admin entreprise ou super admin
router.post('/bulk', requireAdminOrSuper, pointageController.bulkCreate);
// Pointer l'entrée - employé, caissier, admin entreprise ou super admin
router.post('/entree', requireReadAccess, pointageController.pointerEntree);
// Pointer la sortie - employé, caissier, admin entreprise ou super admin
router.post('/sortie', requireReadAccess, pointageController.pointerSortie);
// Lister les pointages - caissier, admin entreprise (de leur entreprise) ou super admin
router.get('/', requireReadAccess, pointageController.getAll);
// Filtrer les pointages - caissier, admin entreprise ou super admin
router.get('/filter', requireReadAccess, pointageController.filter);
// Obtenir un pointage par ID - caissier, admin entreprise ou super admin
router.get('/:id', requireReadAccess, pointageController.getById);
// Mettre à jour un pointage - admin entreprise ou super admin
router.put('/:id', requireAdminOrSuper, pointageController.update);
// Supprimer un pointage - admin entreprise ou super admin
router.delete('/:id', requireAdminOrSuper, pointageController.delete);
// Obtenir les pointages d'un employé - caissier, admin entreprise ou super admin
router.get('/employe/:employeId', requireReadAccess, pointageController.getByEmploye);
// Obtenir les pointages d'un employé pour une période - caissier, admin entreprise ou super admin
router.get('/employe/:employeId/periode', requireReadAccess, pointageController.getByEmployeAndPeriode);
// Obtenir les pointages d'une entreprise pour une période - caissier, admin entreprise ou super admin
router.get('/entreprise/:entrepriseId/periode', requireReadAccess, pointageController.getByEntrepriseAndDate);
// Obtenir les pointages par type - caissier, admin entreprise ou super admin
router.get('/type/:type', requireReadAccess, pointageController.getByType);
// Obtenir les pointages par statut - caissier, admin entreprise ou super admin
router.get('/statut/:statut', requireReadAccess, pointageController.getByStatut);
// Calculer les heures travaillées d'un employé - caissier, admin entreprise ou super admin
router.get('/employe/:employeId/heures', requireReadAccess, pointageController.calculateHeuresTravaillees);
// Obtenir les statistiques de pointage d'une entreprise - caissier, admin entreprise ou super admin
router.get('/entreprise/:entrepriseId/statistiques', requireReadAccess, pointageController.getStatistiques);
export default router;
//# sourceMappingURL=pointageRoutes.js.map