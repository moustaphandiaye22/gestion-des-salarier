import { entrepriseRepository } from '../repositories/entreprise.js';
import { entrepriseSchema } from '../validators/entreprise.js';
import { UtilisateurService } from './utilisateurService.js';
import { utilisateurRepository } from '../repositories/utilisateur.js';
import { mnprisma } from '../config/db.js';
import { AuthUtils } from '../auth/authUtils.js';
import { RoleUtilisateur } from '@prisma/client';

export class EntrepriseService {

    private entrepriseRepository : entrepriseRepository
    private utilisateurService: UtilisateurService;

    constructor(){
        this.entrepriseRepository = new entrepriseRepository();
        this.utilisateurService = new UtilisateurService(new utilisateurRepository());
    }

  async createEntreprise(data: any) {
    const parsed = entrepriseSchema.safeParse(data);
    if (!parsed.success) throw parsed.error;

    const { adminUser, ...entrepriseData } = data;

    // Use transaction to ensure both operations succeed or fail together
    const result = await mnprisma.$transaction(async (tx) => {
      console.log('🔄 Starting enterprise creation transaction...');
      console.log('📊 Enterprise data:', entrepriseData);

      // Create the entreprise
      const entreprise = await tx.entreprise.create({ data: entrepriseData });
      console.log('✅ Enterprise created:', entreprise);

      let adminUtilisateur = null;
      if (adminUser) {
        console.log('👤 Creating admin user:', adminUser);
        // Create the admin user linked to the entreprise using the transaction instance
        const adminData = {
          nom: adminUser.nom,
          email: adminUser.email,
          motDePasse: adminUser.motDePasse,
          role: RoleUtilisateur.ADMIN_ENTREPRISE,
          entrepriseId: entreprise.id
        };
        console.log('📝 Admin data to create:', adminData);

        // Use transaction instance for user creation
        const hashedPassword = await AuthUtils.hashPassword(adminData.motDePasse);
        const userData = {
          ...adminData,
          motDePasse: hashedPassword,
          role: adminData.role,
          estActif: true
        };
        adminUtilisateur = await tx.utilisateur.create({ data: userData });

        console.log('✅ Admin user created:', adminUtilisateur);
      }

      console.log('🎉 Transaction completed successfully');
      return { entreprise, adminUtilisateur };
    });

    return result;
  }

  async getEntreprise(id: number) {
    return await this.entrepriseRepository.findById(id);
  }

  async getAllEntreprises(user?: any) {
    if (user) {
      return this.entrepriseRepository.findAllByUser(user);
    }
    return this.entrepriseRepository.findAll();
  }

  async updateEntreprise(id: number, data: any) {
    const parsed = entrepriseSchema.partial().safeParse(data);
    if (!parsed.success) throw parsed.error;
    return await this.entrepriseRepository.update(id, data);
  }

  async deleteEntreprise(id: number) {
    return await this.entrepriseRepository.delete(id);
  }
}

export const entrepriseService = new EntrepriseService();
