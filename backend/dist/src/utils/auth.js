import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
const JWT_SECRET = config.JWT_SECRET;
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;
export class AuthUtils {
    static async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    static async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    static generateAccessToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    }
    static generateRefreshToken(payload) {
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    }
    static verifyAccessToken(token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'string' || !decoded || typeof decoded.email !== 'string') {
            throw new Error('Token JWT invalide');
        }
        return decoded;
    }
    static verifyRefreshToken(token) {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
        if (typeof decoded === 'string' || !decoded || typeof decoded.email !== 'string') {
            throw new Error('Token JWT invalide');
        }
        return decoded;
    }
}
//# sourceMappingURL=auth.js.map