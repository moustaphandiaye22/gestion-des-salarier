import type { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (!allowedRoles.includes(req.user.profil)) {
      return res.status(403).json({ error: 'Accès refusé : rôle insuffisant' });
    }

    next();
  };
};

export const requireOwnershipOrAdmin = (req: Request, res: Response, next: NextFunction) => {
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
export const requireCashierOrAdmin = requireRole(['CAISSIER', 'ADMIN_ENTREPRISE', 'SUPER_ADMIN']);
export const requireReadAccess = requireRole(['CAISSIER', 'ADMIN_ENTREPRISE', 'SUPER_ADMIN']);
export const requireCompanyAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }

  // Super admin can access all
  if (req.user.profil === 'SUPER_ADMIN') {
    return next();
  }

  // Admin and cashier can only access their own company
  if ((req.user.profil === 'ADMIN_ENTREPRISE' || req.user.profil === 'CAISSIER') && req.user.entrepriseId) {
    const companyId = Number(req.params.id) || req.user.entrepriseId;
    if (req.user.entrepriseId === companyId) {
      return next();
    }
  }

  return res.status(403).json({ error: 'Accès refusé : vous ne pouvez accéder qu\'à votre entreprise' });
};
