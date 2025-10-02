import { Router } from 'express';
import { RapportController } from '../controller/rapportController.js';
import { requireCashierOrAdmin } from '../middleware/rbacMiddleware.js';
const router = Router();
const rapportController = new RapportController();
router.post('/', requireCashierOrAdmin, rapportController.create);
router.get('/', requireCashierOrAdmin, rapportController.getAll);
router.get('/:id', requireCashierOrAdmin, rapportController.getById);
router.get('/:id/pdf', requireCashierOrAdmin, rapportController.downloadPdf);
router.put('/:id', requireCashierOrAdmin, rapportController.update);
router.delete('/:id', requireCashierOrAdmin, rapportController.delete);
export default router;
//# sourceMappingURL=rapportRoutes.js.map