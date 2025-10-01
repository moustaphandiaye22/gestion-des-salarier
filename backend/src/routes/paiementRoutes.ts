import { Router } from 'express';
import { PaiementController } from '../controller/paiementController.js';
import { requireAdminOrSuper } from '../middleware/rbacMiddleware.js';

const router = Router();
const paiementController = new PaiementController();

// Créer un paiement - admin entreprise ou super admin
router.post('/', requireAdminOrSuper, paiementController.create);

// Lister les paiements - admin entreprise ou super admin
router.get('/', requireAdminOrSuper, paiementController.getAll);

// Obtenir un paiement par ID - admin entreprise ou super admin
router.get('/:id', requireAdminOrSuper, paiementController.getById);

// Mettre à jour un paiement - admin entreprise ou super admin
router.put('/:id', requireAdminOrSuper, paiementController.update);

// Supprimer un paiement - admin entreprise ou super admin
router.delete('/:id', requireAdminOrSuper, paiementController.delete);

export default router;
