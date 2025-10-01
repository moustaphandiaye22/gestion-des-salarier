import { Router } from 'express';
import { ProfessionController } from '../controller/professionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireSuperAdmin, requireAdminOrSuper } from '../middleware/rbacMiddleware.js';
const router = Router();
const professionController = new ProfessionController();
// Routes pour les professions
router.get('/', authenticateToken, professionController.getAll.bind(professionController));
router.get('/:id', authenticateToken, professionController.getById.bind(professionController));
router.post('/', authenticateToken, requireAdminOrSuper, professionController.create.bind(professionController));
router.put('/:id', authenticateToken, requireAdminOrSuper, professionController.update.bind(professionController));
router.delete('/:id', authenticateToken, requireSuperAdmin, professionController.delete.bind(professionController));
export default router;
//# sourceMappingURL=professionRoutes.js.map