import { Router } from 'express';
import { ParametreEntrepriseController } from '../controller/parametreEntrepriseController.js';

const router = Router();
const parametreEntrepriseController = new ParametreEntrepriseController();

router.post('/', parametreEntrepriseController.create);
router.get('/', parametreEntrepriseController.getAll);
router.get('/:id', parametreEntrepriseController.getById);
router.put('/:id', parametreEntrepriseController.update);
router.delete('/:id', parametreEntrepriseController.delete);

export default router;
