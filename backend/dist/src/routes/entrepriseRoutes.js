import { Router } from 'express';
import { EntrepriseController } from '../controller/entrepriseController.js';
const router = Router();
const entrepriseController = new EntrepriseController();
router.post('/', entrepriseController.create);
router.get('/', entrepriseController.getAll);
router.get('/:id', entrepriseController.getById);
router.put('/:id', entrepriseController.update);
router.delete('/:id', entrepriseController.delete);
export default router;
//# sourceMappingURL=entrepriseRoutes.js.map