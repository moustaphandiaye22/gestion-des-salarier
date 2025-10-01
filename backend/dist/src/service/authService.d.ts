import type { IAuthService, RegisterData, LoginData, AuthResponse, RefreshResponse, LogoutResponse } from '../interfaces/IAuthService.js';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
export declare class AuthService implements IAuthService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    register(data: RegisterData): Promise<AuthResponse>;
    login(data: LoginData): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<RefreshResponse>;
    logout(refreshToken: string): Promise<LogoutResponse>;
    private generateTokens;
}
export declare const createAuthService: (userRepository: IUserRepository) => IAuthService;
//# sourceMappingURL=authService.d.ts.map