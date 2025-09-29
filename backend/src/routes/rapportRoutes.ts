import { Router } from 'express';
import { RapportController } from '../controller/rapportController.js';

const router = Router();
const rapportController = new RapportController();

router.post('/', rapportController.create);
router.get('/', rapportController.getAll);
router.get('/:id', rapportController.getById);
router.put('/:id', rapportController.update);
router.delete('/:id', rapportController.delete);

export default router;
