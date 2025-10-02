import { Router } from 'express';
import { PaiementController } from '../controller/paiementController.js';
import { requireCashierOrAdmin } from '../middleware/rbacMiddleware.js';
const router = Router();
const paiementController = new PaiementController();
// Créer un paiement - caissier, admin entreprise ou super admin
router.post('/', requireCashierOrAdmin, paiementController.create);
// Lister les paiements - caissier, admin entreprise ou super admin
router.get('/', requireCashierOrAdmin, paiementController.getAll);
// Obtenir un paiement par ID - caissier, admin entreprise ou super admin
router.get('/:id', requireCashierOrAdmin, paiementController.getById);
// Générer le reçu PDF - caissier, admin entreprise ou super admin
router.get('/:id/receipt-pdf', requireCashierOrAdmin, paiementController.generateReceiptPDF);
// Générer la liste des paiements PDF - caissier, admin entreprise ou super admin
router.get('/list-pdf', requireCashierOrAdmin, paiementController.generatePaymentListPDF);
// Mettre à jour un paiement - caissier, admin entreprise ou super admin
router.put('/:id', requireCashierOrAdmin, paiementController.update);
// Supprimer un paiement - caissier, admin entreprise ou super admin
router.delete('/:id', requireCashierOrAdmin, paiementController.delete);
export default router;
//# sourceMappingURL=paiementRoutes.js.map