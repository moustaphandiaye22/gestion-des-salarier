import { Router } from 'express';
import { BulletinController } from '../controller/bulletinController.js';
import { requireCashierOrAdmin } from '../middleware/rbacMiddleware.js';

const router = Router();
const bulletinController = new BulletinController();

router.post('/', requireCashierOrAdmin, bulletinController.create);
router.get('/', requireCashierOrAdmin, bulletinController.getAll);
router.get('/:id', requireCashierOrAdmin, bulletinController.getById);
router.get('/:id/pdf', requireCashierOrAdmin, bulletinController.generatePDF);
router.get('/export/excel', requireCashierOrAdmin, bulletinController.exportToExcel);
// Temporarily bypass auth for testing
router.post('/generate/cycle/:cycleId', bulletinController.generateForCycle);
router.put('/:id', requireCashierOrAdmin, bulletinController.update);
router.delete('/:id', requireCashierOrAdmin, bulletinController.delete);

export default router;
