import { Router } from 'express';
import { UtilisateurController } from '../controller/utilisateurController.js';
const router = Router();
const utilisateurController = new UtilisateurController();
router.post('/', utilisateurController.create);
router.get('/', utilisateurController.getAll);
router.get('/:id', utilisateurController.getById);
router.put('/:id', utilisateurController.update);
router.delete('/:id', utilisateurController.delete);
export default router;
//# sourceMappingURL=utilisateurRoutes.js.map