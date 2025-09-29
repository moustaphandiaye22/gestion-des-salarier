import { Router } from 'express';
import { container } from '../config/container.js';

const router = Router();

// Routes
router.post('/register', container.authController.register);
router.post('/login', container.authController.login);
router.post('/refresh', container.authController.refreshToken);
router.post('/logout', container.authController.logout);

export default router;
