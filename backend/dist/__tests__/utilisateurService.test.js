import { jest } from '@jest/globals';
import { UtilisateurService, createUtilisateurService } from '../src/service/utilisateurService.js';
import { Logger } from '../src/utils/logger.js';
import { ValidationError, NotFoundError } from '../src/errors/CustomError.js';
import { RoleUtilisateur } from '@prisma/client';
// Mock du repository utilisateur
const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEntreprise: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};
// Mock du logger
jest.mock('../src/utils/logger.js');
const mockLogger = Logger;
mockLogger.info = jest.fn();
mockLogger.warn = jest.fn();
mockLogger.error = jest.fn();
describe('UtilisateurService', () => {
    let utilisateurService;
    beforeEach(() => {
        // Reset des mocks
        jest.clearAllMocks();
        // Créer le service avec le repository mock
        utilisateurService = new UtilisateurService(mockRepository);
    });
    describe('createUtilisateur', () => {
        const validUserData = {
            email: 'test@example.com',
            motDePasse: 'password123',
            nom: 'Dupont',
            prenom: 'Jean',
            role: 'EMPLOYE'
        };
        it('devrait créer un utilisateur avec succès', async () => {
            // Arrange
            const expectedUser = {
                id: 1,
                ...validUserData,
                motDePasse: 'hashedPassword',
                role: 'EMPLOYE',
                estActif: true,
                entrepriseId: null
            };
            mockRepository.findByEmail.mockResolvedValue(null);
            mockRepository.create.mockResolvedValue(expectedUser);
            // Act
            const result = await utilisateurService.createUtilisateur(validUserData);
            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Création d\'un nouvel utilisateur', { email: validUserData.email });
            expect(mockRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...validUserData,
                motDePasse: expect.any(String),
                role: 'EMPLOYE',
                estActif: true
            });
            expect(result).toEqual(expectedUser);
        });
        it('devrait lever une ValidationError si l\'email existe déjà', async () => {
            // Arrange
            const existingUser = { id: 1, email: validUserData.email, nom: 'Existing', motDePasse: 'hashed', role: 'EMPLOYE', estActif: true, entrepriseId: null };
            mockRepository.findByEmail.mockResolvedValue(existingUser);
            // Act & Assert
            await expect(utilisateurService.createUtilisateur(validUserData))
                .rejects
                .toThrow(ValidationError);
            expect(mockLogger.warn).toHaveBeenCalledWith('Tentative de création avec un email déjà utilisé', { email: validUserData.email });
        });
        it('devrait lever une ValidationError pour des données invalides', async () => {
            // Arrange
            const invalidData = { email: 'invalid-email', motDePasse: '' };
            // Act & Assert
            await expect(utilisateurService.createUtilisateur(invalidData))
                .rejects
                .toThrow(ValidationError);
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });
    describe('getUtilisateur', () => {
        it('devrait récupérer un utilisateur par ID', async () => {
            // Arrange
            const userId = 1;
            const expectedUser = { id: userId, email: 'test@example.com', nom: 'Test', motDePasse: 'hashed', role: 'EMPLOYE', estActif: true, entrepriseId: null };
            mockRepository.findById.mockResolvedValue(expectedUser);
            // Act
            const result = await utilisateurService.getUtilisateur(userId);
            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Récupération d\'un utilisateur par ID', { id: userId });
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedUser);
        });
        it('devrait lever une NotFoundError si l\'utilisateur n\'existe pas', async () => {
            // Arrange
            const userId = 999;
            mockRepository.findById.mockResolvedValue(null);
            // Act & Assert
            await expect(utilisateurService.getUtilisateur(userId))
                .rejects
                .toThrow(NotFoundError);
            expect(mockLogger.warn).toHaveBeenCalledWith('Utilisateur non trouvé', { id: userId });
        });
        it('devrait lever une ValidationError pour un ID invalide', async () => {
            // Act & Assert
            await expect(utilisateurService.getUtilisateur(0))
                .rejects
                .toThrow(ValidationError);
        });
    });
    describe('getAllUtilisateurs', () => {
        it('devrait récupérer tous les utilisateurs', async () => {
            // Arrange
            const expectedUsers = [
                { id: 1, email: 'user1@example.com', nom: 'User1', motDePasse: 'hashed1', role: 'EMPLOYE', estActif: true, entrepriseId: null },
                { id: 2, email: 'user2@example.com', nom: 'User2', motDePasse: 'hashed2', role: 'EMPLOYE', estActif: true, entrepriseId: null }
            ];
            mockRepository.findAll.mockResolvedValue(expectedUsers);
            // Act
            const result = await utilisateurService.getAllUtilisateurs();
            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Récupération de tous les utilisateurs');
            expect(mockRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedUsers);
            expect(mockLogger.info).toHaveBeenCalledWith('Utilisateurs récupérés avec succès', { count: 2 });
        });
    });
    describe('updateUtilisateur', () => {
        const updateData = { nom: 'Nouveau Nom' };
        it('devrait mettre à jour un utilisateur avec succès', async () => {
            // Arrange
            const userId = 1;
            const existingUser = { id: userId, email: 'test@example.com', nom: 'Test', motDePasse: 'hashed', role: 'EMPLOYE', estActif: true, entrepriseId: null };
            const updatedUser = { ...existingUser, ...updateData };
            mockRepository.findById.mockResolvedValue(existingUser);
            mockRepository.update.mockResolvedValue(updatedUser);
            // Act
            const result = await utilisateurService.updateUtilisateur(userId, updateData);
            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Mise à jour d\'un utilisateur', { id: userId });
            expect(mockRepository.update).toHaveBeenCalledWith(userId, updateData);
            expect(result).toEqual(updatedUser);
        });
        it('devrait lever une NotFoundError si l\'utilisateur n\'existe pas', async () => {
            // Arrange
            const userId = 999;
            mockRepository.update.mockResolvedValue(null);
            // Act & Assert
            await expect(utilisateurService.updateUtilisateur(userId, updateData))
                .rejects
                .toThrow(NotFoundError);
        });
    });
    describe('deleteUtilisateur', () => {
        it('devrait supprimer un utilisateur avec succès', async () => {
            // Arrange
            const userId = 1;
            const existingUser = { id: userId, email: 'test@example.com', nom: 'Test', motDePasse: 'hashed', role: 'EMPLOYE', estActif: true, entrepriseId: null };
            mockRepository.findById.mockResolvedValue(existingUser);
            mockRepository.delete.mockResolvedValue(undefined);
            // Act
            await utilisateurService.deleteUtilisateur(userId);
            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Suppression d\'un utilisateur', { id: userId });
            expect(mockRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockRepository.delete).toHaveBeenCalledWith(userId);
        });
        it('devrait lever une NotFoundError si l\'utilisateur n\'existe pas', async () => {
            // Arrange
            const userId = 999;
            mockRepository.findById.mockResolvedValue(null);
            // Act & Assert
            await expect(utilisateurService.deleteUtilisateur(userId))
                .rejects
                .toThrow(NotFoundError);
        });
    });
});
//# sourceMappingURL=utilisateurService.test.js.map