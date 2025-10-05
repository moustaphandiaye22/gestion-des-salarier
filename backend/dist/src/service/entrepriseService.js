import { entrepriseRepository } from '../repositories/entreprise.js';
import { entrepriseSchema } from '../validators/entreprise.js';
import { UtilisateurService } from './utilisateurService.js';
import { utilisateurRepository } from '../repositories/utilisateur.js';
import { mnprisma } from '../config/db.js';
export class EntrepriseService {
    entrepriseRepository;
    utilisateurService;
    constructor() {
        this.entrepriseRepository = new entrepriseRepository();
        this.utilisateurService = new UtilisateurService(new utilisateurRepository());
    }
    async createEntreprise(data) {
        const parsed = entrepriseSchema.safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        const { adminUser, ...entrepriseData } = data;
        // Use transaction to ensure both operations succeed or fail together
        const result = await mnprisma.$transaction(async (tx) => {
            // Create the entreprise
            const entreprise = await tx.entreprise.create({ data: entrepriseData });
            let adminUtilisateur = null;
            if (adminUser) {
                // Create the admin user linked to the entreprise
                const adminData = {
                    nom: adminUser.nom,
                    email: adminUser.email,
                    motDePasse: adminUser.motDePasse,
                    role: 'ADMIN_ENTREPRISE',
                    entrepriseId: entreprise.id,
                    estActif: true
                };
                adminUtilisateur = await tx.utilisateur.create({ data: adminData });
            }
            return { entreprise, adminUtilisateur };
        });
        return result;
    }
    async getEntreprise(id) {
        return await this.entrepriseRepository.findById(id);
    }
    async getAllEntreprises(user) {
        if (user) {
            return this.entrepriseRepository.findAllByUser(user);
        }
        return this.entrepriseRepository.findAll();
    }
    async updateEntreprise(id, data) {
        const parsed = entrepriseSchema.partial().safeParse(data);
        if (!parsed.success)
            throw parsed.error;
        return await this.entrepriseRepository.update(id, data);
    }
    async deleteEntreprise(id) {
        return await this.entrepriseRepository.delete(id);
    }
}
export const entrepriseService = new EntrepriseService();
//# sourceMappingURL=entrepriseService.js.map