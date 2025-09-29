import { Router } from 'express';
import { TableauDeBordController } from '../controller/tableauDeBordController.js';

const router = Router();
const tableauDeBordController = new TableauDeBordController();

router.post('/', tableauDeBordController.create);
router.get('/', tableauDeBordController.getAll);
router.get('/:id', tableauDeBordController.getById);
router.put('/:id', tableauDeBordController.update);
router.delete('/:id', tableauDeBordController.delete);

export default router;
