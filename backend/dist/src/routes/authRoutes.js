import { Router } from 'express';
import { AuthController } from '../controller/authController.js';
const router = Router();
const authController = new AuthController();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
export default router;
//# sourceMappingURL=authRoutes.js.map