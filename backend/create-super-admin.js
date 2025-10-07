import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function createSuperAdmin() {
  const prisma = new PrismaClient();

  try {
    console.log('🔧 Création d\'un utilisateur SUPER_ADMIN...\n');

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash('superadmin123', 12);

    // Créer l'utilisateur SUPER_ADMIN
    const superAdmin = await prisma.utilisateur.create({
      data: {
        nom: 'Super Admin',
        email: 'superadmin@test.com',
        motDePasse: hashedPassword,
        role: 'SUPER_ADMIN',
        estActif: true
      }
    });

    console.log('✅ SUPER_ADMIN créé avec succès:');
    console.log(`   ID: ${superAdmin.id}`);
    console.log(`   Nom: ${superAdmin.nom}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Rôle: ${superAdmin.role}`);
    console.log('\n🔑 Utilisez ces identifiants pour vous connecter:');
    console.log('   Email: superadmin@test.com');
    console.log('   Mot de passe: superadmin123');

  } catch (error) {
    console.error('❌ Erreur lors de la création du SUPER_ADMIN:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
