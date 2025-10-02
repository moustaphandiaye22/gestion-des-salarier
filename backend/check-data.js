import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Checking data for entreprise ID 2 (AgriSolutions Mali)...\n');

    // Check employees
    const employees = await prisma.employe.findMany({
      where: { entrepriseId: 2 },
      select: { id: true, matricule: true, prenom: true, nom: true }
    });
    console.log(`Employees for entreprise 2: ${employees.length}`);
    employees.forEach(emp => console.log(`  - ${emp.matricule}: ${emp.prenom} ${emp.nom}`));

    // Check bulletins
    const bulletins = await prisma.bulletin.findMany({
      where: {
        employe: { entrepriseId: 2 }
      },
      include: {
        employe: { select: { matricule: true, prenom: true, nom: true } },
        paiements: true
      }
    });
    console.log(`\nBulletins for entreprise 2: ${bulletins.length}`);
    bulletins.forEach(bul => {
      console.log(`  - Bulletin ${bul.numeroBulletin} for ${bul.employe.prenom} ${bul.employe.nom}`);
      console.log(`    Status: ${bul.statutPaiement}, Payments: ${bul.paiements.length}`);
    });

    // Check payments
    const payments = await prisma.paiement.findMany({
      where: { entrepriseId: 2 },
      include: {
        bulletin: {
          include: {
            employe: { select: { matricule: true, prenom: true, nom: true } }
          }
        }
      }
    });
    console.log(`\nPayments for entreprise 2: ${payments.length}`);
    payments.forEach(pay => {
      console.log(`  - Payment ${pay.id}: ${pay.montant} ${pay.modePaiement} (${pay.statut})`);
      console.log(`    For: ${pay.bulletin.employe.prenom} ${pay.bulletin.employe.nom}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
