export interface JwtPayload {
    email: string;
    profil?: string;
    entrepriseId?: number;
}
export declare class AuthUtils {
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    static generateAccessToken(payload: JwtPayload): string;
    static generateRefreshToken(payload: JwtPayload): string;
    static verifyAccessToken(token: string): JwtPayload;
    static verifyRefreshToken(token: string): JwtPayload;
}
//# sourceMappingURL=authUtils.d.ts.map