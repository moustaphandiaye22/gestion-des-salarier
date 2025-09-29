import { Router } from 'express';
import { EmployeController } from '../controller/employeController.js';

const router = Router();
const employeController = new EmployeController();

router.post('/', employeController.create);
router.get('/', employeController.getAll);
router.get('/:id', employeController.getById);
router.put('/:id', employeController.update);
router.delete('/:id', employeController.delete);

export default router;
