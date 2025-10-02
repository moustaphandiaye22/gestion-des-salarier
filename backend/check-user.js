import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('Checking for cashier user...');

    // Find the cashier user
    const user = await prisma.utilisateur.findUnique({
      where: {
        email: 'caissier@agrisolutions.ml'
      },
      include: {
        entreprise: true
      }
    });

    if (user) {
      console.log('User found:', {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        entrepriseId: user.entrepriseId,
        estActif: user.estActif,
        motDePasse: user.motDePasse, // Show hashed password for debugging
        entreprise: user.entreprise ? {
          id: user.entreprise.id,
          nom: user.entreprise.nom
        } : null
      });
    } else {
      console.log('User not found');

      // List all users to see what's available
      console.log('\nAll users in database:');
      const allUsers = await prisma.utilisateur.findMany({
        select: {
          id: true,
          nom: true,
          email: true,
          role: true,
          entrepriseId: true,
          estActif: true
        }
      });
      console.table(allUsers);
    }

    // Also check if there are any enterprises
    console.log('\nEnterprises in database:');
    const enterprises = await prisma.entreprise.findMany({
      select: {
        id: true,
        nom: true,
        estActive: true
      }
    });
    console.table(enterprises);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();