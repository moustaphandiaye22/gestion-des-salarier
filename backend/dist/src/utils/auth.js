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
        return jwt.verify(token, JWT_SECRET);
    }
    static verifyRefreshToken(token) {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    }
}
//# sourceMappingURL=auth.js.map