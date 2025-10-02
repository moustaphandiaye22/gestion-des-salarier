import { Router } from 'express';
import { ParametreGlobalController } from '../controller/parametreGlobalController.js';
import { requireAdminOrSuper } from '../middleware/rbacMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();
const parametreGlobalController = new ParametreGlobalController();

// Toutes les routes nécessitent une authentification et le rôle ADMIN_ENTREPRISE ou SUPER_ADMIN
router.use(authenticateToken);
router.use(requireAdminOrSuper);

router.post('/', parametreGlobalController.create.bind(parametreGlobalController));
router.get('/', parametreGlobalController.getAll.bind(parametreGlobalController));
router.get('/categorie/:categorie', parametreGlobalController.getByCategory.bind(parametreGlobalController));
router.get('/valeur/:cle', parametreGlobalController.getValue.bind(parametreGlobalController));
router.get('/cle/:cle', parametreGlobalController.getByKey.bind(parametreGlobalController));
router.get('/:id', parametreGlobalController.getById.bind(parametreGlobalController));
router.put('/:id', parametreGlobalController.update.bind(parametreGlobalController));
router.delete('/:id', parametreGlobalController.delete.bind(parametreGlobalController));

export default router;
