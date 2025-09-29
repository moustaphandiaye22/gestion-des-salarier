import { AuthService } from '../src/service/authService.js';
import type { IUserRepository } from '../src/interfaces/IUserRepository.js';
import { ValidationError, AuthenticationError } from '../src/errors/CustomError.js';

// Mock du repository utilisateur
const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const authService = new AuthService(mockUserRepository);

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('devrait créer un utilisateur avec succès', async () => {
      const userData = {
        email: 'test@example.com',
        motDePasse: 'password123',
        nom: 'Test',
        prenom: 'User',
        role: 'EMPLOYE' as const,
      };

      const mockUser = {
        id: 1,
        ...userData,
        motDePasse: 'hashedpassword',
        estActif: true,
        entrepriseId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(result.utilisateur).toEqual(mockUser);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        motDePasse: expect.any(String),
        role: 'EMPLOYE',
        estActif: true,
      });
    });

    it('devrait rejeter si l\'email existe déjà', async () => {
      const userData = {
        email: 'existing@example.com',
        motDePasse: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
        motDePasse: 'hashed',
        nom: 'Existing',
        prenom: 'User',
        role: 'EMPLOYE',
        estActif: true,
        entrepriseId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register(userData)).rejects.toThrow(ValidationError);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur avec succès', async () => {
      const loginData = {
        email: 'test@example.com',
        motDePasse: 'password123',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        motDePasse: '$2a$10$hashedpassword',
        nom: 'Test',
        prenom: 'User',
        role: 'EMPLOYE' as const,
        estActif: true,
        entrepriseId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login(loginData);

      expect(result.utilisateur).toEqual(mockUser);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        motDePasse: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
    });

    it('devrait rejeter si le mot de passe est incorrect', async () => {
      const loginData = {
        email: 'test@example.com',
        motDePasse: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        motDePasse: '$2a$10$hashedpassword',
        nom: 'Test',
        prenom: 'User',
        role: 'EMPLOYE' as const,
        estActif: true,
        entrepriseId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('refreshToken', () => {
    it('devrait rafraîchir le token avec succès', async () => {
      const refreshToken = 'valid.refresh.token';

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        motDePasse: 'hashed',
        nom: 'Test',
        role: 'EMPLOYE' as const,
        estActif: true,
        entrepriseId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.refreshToken(refreshToken);

      expect(result.accessToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('devrait se déconnecter avec succès', async () => {
      const result = await authService.logout('someToken');

      expect(result.message).toBe('Déconnexion réussie');
    });
  });
});
