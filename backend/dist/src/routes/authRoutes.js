import { Router } from 'express';
import { container } from '../config/container.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = Router();
// Routes
router.post('/register', container.authController.register);
router.post('/login', container.authController.login);
router.get('/me', authenticateToken, container.authController.getCurrentUser);
router.post('/refresh', container.authController.refreshToken);
router.post('/logout', container.authController.logout);
router.put('/profile', authenticateToken, container.authController.updateProfile);
router.put('/change-password', authenticateToken, container.authController.changePassword);
export default router;
//# sourceMappingURL=authRoutes.js.map