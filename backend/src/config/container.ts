import { utilisateurRepository } from '../repositories/utilisateur.js';
import { employeRepository } from '../repositories/employe.js';
import { createAuthService } from '../service/authService.js';
import { createUtilisateurService } from '../service/utilisateurService.js';
import { createAuthController } from '../controller/authController.js';
import { createUtilisateurController } from '../controller/utilisateurController.js';

// Repositories
const userRepository = new utilisateurRepository();
const employeRepo = new employeRepository();

// Services
const authService = createAuthService(userRepository, employeRepo);
const utilisateurService = createUtilisateurService(userRepository);

// Controllers
const authController = createAuthController(authService);
const utilisateurController = createUtilisateurController(utilisateurService);

// Container object
export const container = {
  // Repositories
  userRepository,

  // Services
  authService,
  utilisateurService,

  // Controllers
  authController,
  utilisateurController,
};
