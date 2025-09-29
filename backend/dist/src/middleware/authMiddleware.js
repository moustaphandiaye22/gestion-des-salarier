import { AuthUtils } from '../auth/authUtils.js';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Token d\'authentification requis' });
    }
    try {
        const decoded = AuthUtils.verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Token invalide' });
    }
};
//# sourceMappingURL=authMiddleware.js.map