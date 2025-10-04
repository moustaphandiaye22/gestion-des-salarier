import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Vérification des données dans la base de données...\n');

    // Vérifier les entreprises
    const entreprises = await prisma.entreprise.findMany();
    console.log(`📊 Entreprises trouvées: ${entreprises.length}`);
    entreprises.forEach(emp => {
      console.log(`  - ${emp.nom} (ID: ${emp.id})`);
    });

    console.log('\n👥 Vérification des employés...');
    // Vérifier les employés
    const employes = await prisma.employe.findMany({
      include: {
        entreprise: true,
        profession: true
      }
    });

    console.log(`\n👥 Employés trouvés: ${employes.length}`);
    if (employes.length > 0) {
      employes.forEach(emp => {
        console.log(`  - ${emp.prenom} ${emp.nom} (ID: ${emp.id})`);
        console.log(`    Entreprise: ${emp.entreprise?.nom || 'N/A'}`);
        console.log(`    Profession: ${emp.profession?.nom || 'N/A'}`);
        console.log(`    Matricule: ${emp.matricule}`);
        console.log(`    Statut: ${emp.statutEmploi}`);
        console.log(`    Salaire: ${emp.salaireBase} FCFA`);
        console.log(`    Statistiques: ${emp.totalPresences} présences, ${emp.totalAbsences} absences`);
        console.log('    ---');
      });
    } else {
      console.log('❌ Aucun employé trouvé dans la base de données!');
    }

    // Vérifier les utilisateurs
    const utilisateurs = await prisma.utilisateur.findMany({
      include: {
        entreprise: true
      }
    });
    console.log(`\n👤 Utilisateurs trouvés: ${utilisateurs.length}`);
    utilisateurs.forEach(user => {
      console.log(`  - ${user.nom} (${user.email}) - Rôle: ${user.role}`);
      console.log(`    Entreprise: ${user.entreprise?.nom || 'N/A'}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();