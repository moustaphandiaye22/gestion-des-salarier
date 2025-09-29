import { Router } from 'express';
import { PaiementController } from '../controller/paiementController.js';

const router = Router();
const paiementController = new PaiementController();

router.post('/', paiementController.create);
router.get('/', paiementController.getAll);
router.get('/:id', paiementController.getById);
router.put('/:id', paiementController.update);
router.delete('/:id', paiementController.delete);

export default router;
