export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        if (!allowedRoles.includes(req.user.profil)) {
            return res.status(403).json({ error: 'Accès refusé : rôle insuffisant' });
        }
        next();
    };
};
export const requireOwnershipOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
    const userId = Number(req.params.id);
    const isAdmin = req.user.profil === 'ADMIN_ENTREPRISE' || req.user.profil === 'SUPER_ADMIN';
    const isOwner = req.user.id === userId;
    if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres données' });
    }
    next();
};
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);
export const requireAdminOrSuper = requireRole(['ADMIN_ENTREPRISE', 'SUPER_ADMIN']);
export const requireAdminOrSuperOrVigile = requireRole(['ADMIN_ENTREPRISE', 'SUPER_ADMIN', 'VIGILE']);
export const requireCashierOrAdmin = requireRole(['CAISSIER', 'ADMIN_ENTREPRISE', 'SUPER_ADMIN']);
export const requireReadAccess = requireRole(['CAISSIER', 'VIGILE', 'ADMIN_ENTREPRISE', 'SUPER_ADMIN']);
export const requireCompanyAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
    // Super admin can access all companies
    if (req.user.profil === 'SUPER_ADMIN') {
        return next();
    }
    // Admin, cashier, and vigile can only access their own company
    if ((req.user.profil === 'ADMIN_ENTREPRISE' || req.user.profil === 'CAISSIER' || req.user.profil === 'VIGILE') && req.user.entrepriseId) {
        const companyId = Number(req.params.id) || req.user.entrepriseId;
        if (req.user.entrepriseId === companyId) {
            return next();
        }
    }
    return res.status(403).json({ error: 'Accès refusé : vous ne pouvez accéder qu\'à votre entreprise' });
};
export const requireSuperAdminAccess = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
    // If not super admin, allow access (regular company access rules apply)
    if (req.user.profil !== 'SUPER_ADMIN') {
        return next();
    }
    // For super admin, check if the company has granted access
    // The ID could be employee ID, payment ID, etc. We need to find the company ID
    const resourceId = Number(req.params.id);
    if (!resourceId) {
        return res.status(400).json({ error: 'ID de ressource requis' });
    }
    try {
        let companyId = null;
        // Determine the resource type from the route
        const baseUrl = req.baseUrl; // This gives /api/entreprises, /api/employes, etc.
        if (baseUrl.includes('/employes') || baseUrl.includes('/pointages') || baseUrl.includes('/paiements') || baseUrl.includes('/bulletins')) {
            // For employee-related resources, find the employee's company
            if (baseUrl.includes('/employes')) {
                const { employeRepository } = await import('../repositories/employe.js');
                const repo = new employeRepository();
                const employe = await repo.findById(resourceId);
                companyId = employe?.entrepriseId || null;
            }
            else if (baseUrl.includes('/pointages')) {
                const { pointageRepository } = await import('../repositories/pointage.js');
                const repo = new pointageRepository();
                const pointage = await repo.findById(resourceId);
                companyId = pointage?.employe?.entrepriseId || null;
            }
            else if (baseUrl.includes('/paiements')) {
                const { paiementRepository } = await import('../repositories/paiement.js');
                const repo = new paiementRepository();
                const paiement = await repo.findById(resourceId);
                // Need to get bulletin to find employee
                if (paiement?.bulletinId) {
                    const { bulletinRepository } = await import('../repositories/bulletin.js');
                    const bulletinRepo = new bulletinRepository();
                    const bulletin = await bulletinRepo.findById(paiement.bulletinId);
                    if (bulletin?.employeId) {
                        const { employeRepository } = await import('../repositories/employe.js');
                        const employeRepo = new employeRepository();
                        const employe = await employeRepo.findById(bulletin.employeId);
                        companyId = employe?.entrepriseId || null;
                    }
                }
            }
            else if (baseUrl.includes('/bulletins')) {
                const { bulletinRepository } = await import('../repositories/bulletin.js');
                const repo = new bulletinRepository();
                const bulletin = await repo.findById(resourceId);
                // Need to get employee to find company
                if (bulletin?.employeId) {
                    const { employeRepository } = await import('../repositories/employe.js');
                    const employeRepo = new employeRepository();
                    const employe = await employeRepo.findById(bulletin.employeId);
                    companyId = employe?.entrepriseId || null;
                }
            }
        }
        else if (baseUrl.includes('/entreprises')) {
            // For enterprise routes, the ID is already the company ID
            companyId = resourceId;
        }
        if (!companyId) {
            return res.status(404).json({ error: 'Entreprise non trouvée pour cette ressource' });
        }
        // Check if the company has granted access
        const { entrepriseRepository } = await import('../repositories/entreprise.js');
        const entrepriseRepo = new entrepriseRepository();
        const entreprise = await entrepriseRepo.findByIdForAccessCheck(companyId);
        if (!entreprise) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }
        if (!entreprise.superAdminAccessGranted) {
            return res.status(403).json({ error: 'Accès refusé : l\'entreprise n\'a pas accordé l\'accès super admin' });
        }
        next();
    }
    catch (error) {
        console.error('Erreur lors de la vérification de l\'accès super admin:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
//# sourceMappingURL=rbacMiddleware.js.map