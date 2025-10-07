import { Router } from 'express';
import { EntrepriseController } from '../controller/entrepriseController.js';
import { requireSuperAdmin, requireAdminOrSuper, requireCompanyAccess, requireReadAccess, requireSuperAdminAccess } from '../middleware/rbacMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const entrepriseController = new EntrepriseController();
// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const assetsDir = path.join(__dirname, '../../assets/images/logos');
        cb(null, assetsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Seul les fichiers images sont autorisés'));
        }
    }
});
// Créer une entreprise - seulement super admin
router.post('/', requireSuperAdmin, upload.single('logo'), entrepriseController.create);
// Lister toutes les entreprises - caissier, super admin voit toutes, admin entreprise voit la sienne
router.get('/', requireReadAccess, entrepriseController.getAll);
// Obtenir les détails d'une entreprise - caissier, super admin (avec autorisation) ou admin de l'entreprise
router.get('/:id', requireSuperAdminAccess, entrepriseController.getById);
// Mettre à jour une entreprise - super admin (avec autorisation) ou admin de l'entreprise
router.put('/:id', requireSuperAdminAccess, upload.single('logo'), entrepriseController.update);
// Supprimer une entreprise - seulement super admin
router.delete('/:id', requireSuperAdmin, entrepriseController.delete);
export default router;
//# sourceMappingURL=entrepriseRoutes.js.map