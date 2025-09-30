import { Router } from 'express';
import { container } from '../config/container.js';
import { requireAdminOrSuper, requireOwnershipOrAdmin } from '../middleware/rbacMiddleware.js';

const router = Router();

// Créer un utilisateur - admin entreprise ou super admin
router.post('/', requireAdminOrSuper, container.utilisateurController.create);

// Lister les utilisateurs - admin entreprise (de leur entreprise) ou super admin
router.get('/', requireAdminOrSuper, container.utilisateurController.getAll);

// Obtenir un utilisateur par ID - propriétaire ou admin
router.get('/:id', requireOwnershipOrAdmin, container.utilisateurController.getById);

// Mettre à jour un utilisateur - propriétaire ou admin
router.put('/:id', requireOwnershipOrAdmin, container.utilisateurController.update);

// Supprimer un utilisateur - admin entreprise ou super admin
router.delete('/:id', requireAdminOrSuper, container.utilisateurController.delete);

export default router;
