import type { Utilisateur } from '@prisma/client';
import type { IAuthService, RegisterData, LoginData, AuthResponse, RefreshResponse, LogoutResponse } from '../interfaces/IAuthService.js';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
import { employeRepository } from '../repositories/employe.js';
export declare class AuthService implements IAuthService {
    private userRepository;
    private employeRepo;
    constructor(userRepository: IUserRepository, employeRepo: employeRepository);
    register(data: RegisterData): Promise<AuthResponse>;
    login(data: LoginData): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<RefreshResponse>;
    logout(refreshToken: string): Promise<LogoutResponse>;
    updateProfile(userId: string, profileData: any): Promise<{
        utilisateur: Utilisateur;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    private generateTokens;
    private generateTokensForUser;
}
export declare const createAuthService: (userRepository: IUserRepository, employeRepository: employeRepository) => IAuthService;
//# sourceMappingURL=authService.d.ts.map