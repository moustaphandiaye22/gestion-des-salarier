import { Router } from 'express';
import { container } from '../config/container.js';

const router = Router();

// Routes
router.post('/', container.utilisateurController.create);
router.get('/', container.utilisateurController.getAll);
router.get('/:id', container.utilisateurController.getById);
router.put('/:id', container.utilisateurController.update);
router.delete('/:id', container.utilisateurController.delete);

export default router;
