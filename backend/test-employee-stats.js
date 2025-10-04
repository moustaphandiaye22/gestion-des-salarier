import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testEmployeeStats() {
  try {
    console.log('🧪 Test de l\'API des statistiques employé...\n');

    // Récupérer le premier employé
    const employe = await prisma.employe.findFirst({
      include: { entreprise: true, profession: true }
    });

    if (!employe) {
      console.log('❌ Aucun employé trouvé');
      return;
    }

    console.log(`👤 Employé test: ${employe.prenom} ${employe.nom} (ID: ${employe.id})`);

    // Récupérer les pointages de cet employé
    const pointages = await prisma.pointage.findMany({
      where: { employeId: employe.id }
    });

    console.log(`📊 Pointages trouvés: ${pointages.length}`);

    // Calculer les statistiques manuellement
    let totalPresences = 0;
    let totalAbsences = 0;
    let totalRetards = 0;
    let totalHeures = 0;
    let dernierPointage = null;

    for (const pointage of pointages) {
      if (pointage.statut === 'PRESENT') {
        totalPresences++;
        if (pointage.dureeTravail) {
          totalHeures += Number(pointage.dureeTravail);
        }
      } else if (pointage.statut === 'ABSENT') {
        totalAbsences++;
      }

      // Calculer les retards (heure d'entrée après 9h pour les présents)
      if (pointage.statut === 'PRESENT' && pointage.heureEntree) {
        const heureEntree = new Date(pointage.heureEntree);
        const heureLimite = new Date(pointage.heureEntree);
        heureLimite.setHours(9, 0, 0, 0);

        if (heureEntree > heureLimite) {
          totalRetards++;
        }
      }

      // Dernier pointage
      if (pointage.datePointage && (!dernierPointage || pointage.datePointage > dernierPointage)) {
        dernierPointage = pointage.datePointage;
      }
    }

    console.log('\n📈 Statistiques calculées:');
    console.log(`   Présences: ${totalPresences}`);
    console.log(`   Absences: ${totalAbsences}`);
    console.log(`   Retards: ${totalRetards}`);
    console.log(`   Heures travaillées: ${totalHeures}`);
    console.log(`   Dernier pointage: ${dernierPointage}`);

    // Créer quelques pointages de test si nécessaire
    if (pointages.length === 0) {
      console.log('\n🔧 Création de pointages de test...');

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      await prisma.pointage.create({
        data: {
          datePointage: yesterday,
          heureEntree: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 8, 30),
          heureSortie: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 17, 30),
          dureeTravail: 8.5,
          typePointage: 'PRESENCE',
          statut: 'PRESENT',
          employeId: employe.id,
          entrepriseId: employe.entrepriseId,
        }
      });

      await prisma.pointage.create({
        data: {
          datePointage: today,
          heureEntree: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15), // Retard de 15 minutes
          heureSortie: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
          dureeTravail: 8.0,
          typePointage: 'PRESENCE',
          statut: 'PRESENT',
          employeId: employe.id,
          entrepriseId: employe.entrepriseId,
        }
      });

      console.log('✅ Pointages de test créés');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmployeeStats();