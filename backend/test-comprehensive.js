import { PrismaClient } from '@prisma/client';
import { EntrepriseService } from './dist/src/service/entrepriseService.js';
import { UtilisateurService } from './dist/src/service/utilisateurService.js';
import { utilisateurRepository } from './dist/src/repositories/utilisateur.js';

async function testComprehensive() {
  const prisma = new PrismaClient();

  try {
    console.log('🧪 Tests complets de création d\'entreprise et utilisateur...\n');

    const entrepriseService = new EntrepriseService();
    const utilisateurService = new UtilisateurService(new utilisateurRepository());

    // Test 1: Enterprise creation without admin user
    console.log('📋 Test 1: Création d\'entreprise sans utilisateur admin');
    const testData1 = {
      nom: 'Test Entreprise Sans Admin',
      description: 'Entreprise de test sans admin',
      adresse: 'Test Address',
      telephone: '+221 77 123 45 67',
      email: 'test-sans-admin@entreprise.com',
      couleurPrimaire: '#FF0000',
      couleurSecondaire: '#00FF00',
      estActive: true
    };

    try {
      const result1 = await entrepriseService.createEntreprise(testData1);
      console.log('✅ Test 1 réussi - Entreprise créée:', result1.entreprise.nom);
      console.log('   Admin utilisateur:', result1.adminUtilisateur || 'Aucun');
    } catch (error) {
      console.log('❌ Test 1 échoué:', error.message);
    }

    // Test 2: Enterprise creation with duplicate name
    console.log('\n📋 Test 2: Création d\'entreprise avec nom dupliqué');
    const testData2 = {
      nom: 'Test Entreprise Sans Admin', // Same name as test 1
      description: 'Entreprise dupliquée',
      adresse: 'Test Address 2',
      telephone: '+221 77 123 45 68',
      email: 'test-duplicate@entreprise.com',
      couleurPrimaire: '#FF0000',
      couleurSecondaire: '#00FF00',
      estActive: true
    };

    try {
      const result2 = await entrepriseService.createEntreprise(testData2);
      console.log('❌ Test 2 échoué - Devrait avoir échoué avec nom dupliqué');
    } catch (error) {
      console.log('✅ Test 2 réussi - Erreur attendue pour nom dupliqué:', error.message);
    }

    // Test 3: Enterprise creation with invalid data
    console.log('\n📋 Test 3: Création d\'entreprise avec données invalides');
    const testData3 = {
      nom: '', // Invalid: empty name
      description: 'Entreprise invalide',
      adresse: 'Test Address',
      telephone: 'invalid-phone',
      email: 'invalid-email',
      couleurPrimaire: '#FF0000',
      couleurSecondaire: '#00FF00',
      estActive: true
    };

    try {
      const result3 = await entrepriseService.createEntreprise(testData3);
      console.log('❌ Test 3 échoué - Devrait avoir échoué avec données invalides');
    } catch (error) {
      console.log('✅ Test 3 réussi - Erreur attendue pour données invalides:', error.message);
    }

    // Test 4: User creation with duplicate email
    console.log('\n📋 Test 4: Création d\'utilisateur avec email dupliqué');
    const userData1 = {
      nom: 'Test User 1',
      email: 'duplicate@test.com',
      motDePasse: 'password123',
      role: 'EMPLOYE',
      entrepriseId: 1
    };

    const userData2 = {
      nom: 'Test User 2',
      email: 'duplicate@test.com', // Same email
      motDePasse: 'password456',
      role: 'EMPLOYE',
      entrepriseId: 1
    };

    try {
      await utilisateurService.createUtilisateur(userData1);
      console.log('✅ Premier utilisateur créé');

      await utilisateurService.createUtilisateur(userData2);
      console.log('❌ Test 4 échoué - Devrait avoir échoué avec email dupliqué');
    } catch (error) {
      console.log('✅ Test 4 réussi - Erreur attendue pour email dupliqué:', error.message);
    }

    // Test 5: User creation with invalid data
    console.log('\n📋 Test 5: Création d\'utilisateur avec données invalides');
    const invalidUserData = {
      nom: '', // Invalid: empty name
      email: 'invalid-email',
      motDePasse: '123', // Too short
      role: 'INVALID_ROLE',
      entrepriseId: 999 // Non-existent enterprise
    };

    try {
      await utilisateurService.createUtilisateur(invalidUserData);
      console.log('❌ Test 5 échoué - Devrait avoir échoué avec données invalides');
    } catch (error) {
      console.log('✅ Test 5 réussi - Erreur attendue pour données invalides:', error.message);
    }

    // Test 6: Valid user creation
    console.log('\n📋 Test 6: Création d\'utilisateur valide');
    const validUserData = {
      nom: 'Valid Test User',
      email: 'valid-test@test.com',
      motDePasse: 'validpassword123',
      role: 'EMPLOYE',
      entrepriseId: 1
    };

    try {
      const validUser = await utilisateurService.createUtilisateur(validUserData);
      console.log('✅ Test 6 réussi - Utilisateur créé:', validUser.nom, validUser.email);
    } catch (error) {
      console.log('❌ Test 6 échoué:', error.message);
    }

    console.log('\n🎉 Tests complets terminés!');

  } catch (error) {
    console.error('\n❌ Erreur générale lors des tests:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testComprehensive();
