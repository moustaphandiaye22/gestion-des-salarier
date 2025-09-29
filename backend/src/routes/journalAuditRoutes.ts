import { Router } from 'express';
import { JournalAuditController } from '../controller/journalAuditController.js';

const router = Router();
const journalAuditController = new JournalAuditController();

router.post('/', journalAuditController.create);
router.get('/', journalAuditController.getAll);
router.get('/:id', journalAuditController.getById);
router.put('/:id', journalAuditController.update);
router.delete('/:id', journalAuditController.delete);

export default router;
