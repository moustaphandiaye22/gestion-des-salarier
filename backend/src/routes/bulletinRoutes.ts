import { Router } from 'express';
import { BulletinController } from '../controller/bulletinController.js';

const router = Router();
const bulletinController = new BulletinController();

router.post('/', bulletinController.create);
router.get('/', bulletinController.getAll);
router.get('/:id', bulletinController.getById);
router.get('/:id/pdf', bulletinController.generatePDF);
router.put('/:id', bulletinController.update);
router.delete('/:id', bulletinController.delete);

export default router;
