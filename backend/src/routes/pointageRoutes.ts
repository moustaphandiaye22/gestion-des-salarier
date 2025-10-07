import { Router } from 'express';
import { PointageController } from '../controller/pointageController.js';
import { requireAdminOrSuper, requireAdminOrSuperOrVigile, requireReadAccess } from '../middleware/rbacMiddleware.js';

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

// Lister les pointages - admin entreprise, super admin ou vigile
router.get('/', requireAdminOrSuperOrVigile, pointageController.getAll);

// Filtrer les pointages - admin entreprise, super admin ou vigile
router.get('/filter', requireAdminOrSuperOrVigile, pointageController.filter);

// Obtenir un pointage par ID - admin entreprise ou super admin
router.get('/:id', requireAdminOrSuper, pointageController.getById);

// Mettre à jour un pointage - admin entreprise ou super admin
router.put('/:id', requireAdminOrSuper, pointageController.update);

// Supprimer un pointage - admin entreprise ou super admin
router.delete('/:id', requireAdminOrSuper, pointageController.delete);

// Obtenir les pointages d'un employé - admin entreprise ou super admin
router.get('/employe/:employeId', requireAdminOrSuper, pointageController.getByEmploye);

// Obtenir les pointages d'un employé pour une période - admin entreprise ou super admin
router.get('/employe/:employeId/periode', requireAdminOrSuper, pointageController.getByEmployeAndPeriode);

// Obtenir les pointages d'une entreprise pour une période - admin entreprise ou super admin
router.get('/entreprise/:entrepriseId/periode', requireAdminOrSuper, pointageController.getByEntrepriseAndDate);

// Obtenir les pointages par type - admin entreprise ou super admin
router.get('/type/:type', requireAdminOrSuper, pointageController.getByType);

// Obtenir les pointages par statut - admin entreprise ou super admin
router.get('/statut/:statut', requireAdminOrSuper, pointageController.getByStatut);

// Calculer les heures travaillées d'un employé - admin entreprise ou super admin
router.get('/employe/:employeId/heures', requireAdminOrSuper, pointageController.calculateHeuresTravaillees);

// Obtenir les statistiques de pointage d'une entreprise - admin entreprise ou super admin
router.get('/entreprise/:entrepriseId/statistiques', requireAdminOrSuper, pointageController.getStatistiques);

export default router;