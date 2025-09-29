import { Router } from 'express';
import { CyclePaieController } from '../controller/cyclePaieController.js';
const router = Router();
const cyclePaieController = new CyclePaieController();
router.post('/', cyclePaieController.create);
router.get('/', cyclePaieController.getAll);
router.get('/:id', cyclePaieController.getById);
router.put('/:id', cyclePaieController.update);
router.delete('/:id', cyclePaieController.delete);
export default router;
//# sourceMappingURL=cyclePaieRoutes.js.map