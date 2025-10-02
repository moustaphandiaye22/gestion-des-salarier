import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testDataAccess() {
  try {
    console.log('Testing data access...');

    // Check if we have any users
    const users = await prisma.utilisateur.findMany();
    console.log(`Found ${users.length} users`);

    // Check if we have any payments
    const payments = await prisma.paiement.findMany({
      include: { entreprise: true, bulletin: true }
    });
    console.log(`Found ${payments.length} payments`);

    // Check if we have any bulletins
    const bulletins = await prisma.bulletin.findMany({
      include: { employe: true, cycle: true, paiements: true }
    });
    console.log(`Found ${bulletins.length} bulletins`);

    // Check if we have any rapports
    const rapports = await prisma.rapport.findMany();
    console.log(`Found ${rapports.length} rapports`);

    // Test filtering for a CAISSIER user
    const cashierUser = users.find(u => u.role === 'CAISSIER');
    if (cashierUser) {
      console.log(`\nTesting CAISSIER user: ${cashierUser.email}`);
      console.log(`User entrepriseId: ${cashierUser.entrepriseId}`);

      // Test payment filtering
      const cashierPayments = payments.filter(p => p.entrepriseId === cashierUser.entrepriseId);
      console.log(`CAISSIER should see ${cashierPayments.length} payments`);

      // Test bulletin filtering
      const cashierBulletins = bulletins.filter(b => b.employe?.entrepriseId === cashierUser.entrepriseId);
      console.log(`CAISSIER should see ${cashierBulletins.length} bulletins`);
    }

    // Test filtering for SUPER_ADMIN
    const superAdminUser = users.find(u => u.role === 'SUPER_ADMIN');
    if (superAdminUser) {
      console.log(`\nTesting SUPER_ADMIN user: ${superAdminUser.email}`);
      console.log(`SUPER_ADMIN should see ${payments.length} payments`);
      console.log(`SUPER_ADMIN should see ${bulletins.length} bulletins`);
    }

  } catch (error) {
    console.error('Error testing data access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDataAccess();
