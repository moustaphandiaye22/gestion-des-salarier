import { PrismaClient } from '@prisma/client';
import { EntrepriseService } from './dist/src/service/entrepriseService.js';

async function testEnterpriseCreation() {
  const prisma = new PrismaClient();

  try {
    console.log('🧪 Test de création d\'entreprise...\n');

    const entrepriseService = new EntrepriseService();

    const testData = {
      nom: 'Test Entreprise',
      description: 'Entreprise de test',
      adresse: 'Test Address',
      telephone: '+221 77 123 45 67',
      email: 'test@entreprise.com',
      couleurPrimaire: '#FF0000',
      couleurSecondaire: '#00FF00',
      estActive: true,
      adminUser: {
        nom: 'Admin',
        email: 'admin@test.com',
        motDePasse: 'admin123'
      }
    };

    console.log('Données de test:', JSON.stringify(testData, null, 2));

    const result = await entrepriseService.createEntreprise(testData);

    console.log('\n✅ Entreprise créée avec succès:');
    console.log('Entreprise:', result.entreprise);
    console.log('Admin utilisateur:', result.adminUtilisateur);

  } catch (error) {
    console.error('\n❌ Erreur lors de la création:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testEnterpriseCreation();
