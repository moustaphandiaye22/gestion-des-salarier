import { Router } from 'express';
import { EmployeController } from '../controller/employeController.js';
import { requireAdminOrSuper } from '../middleware/rbacMiddleware.js';

const router = Router();
const employeController = new EmployeController();

// Créer un employé - admin entreprise ou super admin
router.post('/', requireAdminOrSuper, employeController.create);

// Lister les employés - admin entreprise (de leur entreprise) ou super admin
router.get('/', requireAdminOrSuper, employeController.getAll);

// Obtenir un employé par ID - admin entreprise ou super admin
router.get('/:id', requireAdminOrSuper, employeController.getById);

// Mettre à jour un employé - admin entreprise ou super admin
router.put('/:id', requireAdminOrSuper, employeController.update);

// Supprimer un employé - admin entreprise ou super admin
router.delete('/:id', requireAdminOrSuper, employeController.delete);

export default router;
