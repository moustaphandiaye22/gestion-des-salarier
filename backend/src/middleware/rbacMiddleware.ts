import type { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (!allowedRoles.includes(req.user.role)) {
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
  const isAdmin = req.user.role === 'ADMIN';
  const isOwner = req.user.id === userId;

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ error: 'Accès refusé : vous ne pouvez modifier que vos propres données' });
  }

  next();
};
