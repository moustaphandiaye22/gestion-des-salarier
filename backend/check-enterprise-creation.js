import { PrismaClient } from '@prisma/client';

async function checkEnterpriseCreation() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Vérification de la création d\'entreprise...\n');

    // Vérifier l'entreprise créée
    const entreprise = await prisma.entreprise.findFirst({
      where: { nom: 'Test Entreprise' },
      select: {
        id: true,
        nom: true,
        email: true,
        dateCreation: true
      }
    });

    if (entreprise) {
      console.log('✅ Entreprise trouvée:');
      console.log(`   ID: ${entreprise.id}`);
      console.log(`   Nom: ${entreprise.nom}`);
      console.log(`   Email: ${entreprise.email}`);
      console.log(`   Date de création: ${entreprise.dateCreation}\n`);
    } else {
      console.log('❌ Aucune entreprise "Test Entreprise" trouvée\n');
      return;
    }

    // Vérifier l'utilisateur admin créé
    const adminUser = await prisma.utilisateur.findFirst({
      where: {
        email: 'admin@test.com',
        entrepriseId: entreprise.id
      },
      select: {
        id: true,
        nom: true,
        email: true,
        motDePasse: true,
        role: true,
        entrepriseId: true
      }
    });

    if (adminUser) {
      console.log('✅ Utilisateur admin trouvé:');
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Nom: ${adminUser.nom}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Rôle: ${adminUser.role}`);
      console.log(`   Entreprise ID: ${adminUser.entrepriseId}`);

      // Vérifier si le mot de passe est hashé
      const isHashed = adminUser.motDePasse.startsWith('$2b$') || adminUser.motDePasse.startsWith('$2a$');
      console.log(`   Mot de passe hashé: ${isHashed ? '✅ OUI' : '❌ NON'}`);
      console.log(`   Longueur du hash: ${adminUser.motDePasse.length} caractères`);

      if (isHashed) {
        console.log('\n🎉 SUCCÈS: Le mot de passe de l\'admin a été correctement hashé!');
      } else {
        console.log('\n⚠️ ATTENTION: Le mot de passe n\'est pas hashé!');
      }
    } else {
      console.log('❌ Aucun utilisateur admin trouvé avec l\'email admin@test.com');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnterpriseCreation();
