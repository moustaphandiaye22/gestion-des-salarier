import type { Utilisateur } from '@prisma/client';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
export interface CreateUtilisateurData {
    email: string;
    motDePasse: string;
    nom?: string;
    prenom?: string;
    role?: string;
    entrepriseId?: number;
}
export interface UpdateUtilisateurData {
    email?: string;
    motDePasse?: string;
    nom?: string;
    prenom?: string;
    role?: string;
    estActif?: boolean;
    entrepriseId?: number;
}
export interface IUtilisateurService {
    createUtilisateur(data: CreateUtilisateurData): Promise<Utilisateur>;
    getUtilisateur(id: number): Promise<Utilisateur | null>;
    getAllUtilisateurs(): Promise<Utilisateur[]>;
    getUtilisateursByEntreprise(entrepriseId: number): Promise<Utilisateur[]>;
    updateUtilisateur(id: number, data: UpdateUtilisateurData): Promise<Utilisateur | null>;
    deleteUtilisateur(id: number): Promise<void>;
}
export declare class UtilisateurService implements IUtilisateurService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    createUtilisateur(data: CreateUtilisateurData): Promise<Utilisateur>;
    getUtilisateur(id: number): Promise<Utilisateur | null>;
    getAllUtilisateurs(): Promise<Utilisateur[]>;
    getUtilisateursByEntreprise(entrepriseId: number): Promise<Utilisateur[]>;
    updateUtilisateur(id: number, data: UpdateUtilisateurData): Promise<Utilisateur | null>;
    deleteUtilisateur(id: number): Promise<void>;
}
export declare const createUtilisateurService: (userRepository: IUserRepository) => IUtilisateurService;
//# sourceMappingURL=utilisateurService.d.ts.map