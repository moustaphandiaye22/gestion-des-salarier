import { Router } from 'express';
import { JournalAuditController } from '../controller/journalAuditController.js';
import { requireReadAccess } from '../middleware/rbacMiddleware.js';
const router = Router();
const journalAuditController = new JournalAuditController();
router.post('/', requireReadAccess, journalAuditController.create);
router.get('/', requireReadAccess, journalAuditController.getAll);
router.get('/:id', requireReadAccess, journalAuditController.getById);
router.put('/:id', requireReadAccess, journalAuditController.update);
router.delete('/:id', requireReadAccess, journalAuditController.delete);
export default router;
//# sourceMappingURL=journalAuditRoutes.js.map