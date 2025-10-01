import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Test de la base de données...\n');

  try {
    // Test 1: Vérifier les utilisateurs
    console.log('1️⃣ Test des utilisateurs:');
    const users = await prisma.utilisateur.findMany({
      select: { id: true, email: true, role: true, entrepriseId: true }
    });
    console.log(`✅ ${users.length} utilisateurs trouvés:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id}, Rôle: ${user.role}, Entreprise: ${user.entrepriseId || 'N/A'})`);
    });

    // Test 2: Vérifier les entreprises
    console.log('\n2️⃣ Test des entreprises:');
    const entreprises = await prisma.entreprise.findMany({
      select: { id: true, nom: true, estActive: true }
    });
    console.log(`✅ ${entreprises.length} entreprises trouvées:`);
    entreprises.forEach(entreprise => {
      console.log(`   - ${entreprise.nom} (ID: ${entreprise.id}, Active: ${entreprise.estActive})`);
    });

    // Test 3: Vérifier les tableaux de bord
    console.log('\n3️⃣ Test des tableaux de bord:');
    const dashboards = await prisma.tableauDeBord.findMany({
      select: { id: true, nom: true, entrepriseId: true }
    });
    console.log(`✅ ${dashboards.length} tableaux de bord trouvés:`);
    dashboards.forEach(dashboard => {
      console.log(`   - ${dashboard.nom} (ID: ${dashboard.id}, Entreprise: ${dashboard.entrepriseId})`);
    });

    // Test 4: Vérifier les KPIs
    console.log('\n4️⃣ Test des données KPI:');
    const kpis = await prisma.kpiData.findMany({
      select: { id: true, nom: true, valeur: true, entrepriseId: true }
    });
    console.log(`✅ ${kpis.length} données KPI trouvées:`);
    kpis.forEach(kpi => {
      console.log(`   - ${kpi.nom}: ${kpi.valeur} (Entreprise: ${kpi.entrepriseId})`);
    });

    // Test 5: Vérifier les alertes
    console.log('\n5️⃣ Test des alertes:');
    const alertes = await prisma.alerte.findMany({
      select: { id: true, titre: true, type: true, entrepriseId: true }
    });
    console.log(`✅ ${alertes.length} alertes trouvées:`);
    alertes.forEach(alerte => {
      console.log(`   - ${alerte.titre} (${alerte.type}, Entreprise: ${alerte.entrepriseId})`);
    });

    // Test 6: Vérifier les widgets
    console.log('\n6️⃣ Test des widgets:');
    const widgets = await prisma.widget.findMany({
      select: { id: true, nom: true, type: true, tableauDeBordId: true }
    });
    console.log(`✅ ${widgets.length} widgets trouvés:`);
    widgets.forEach(widget => {
      console.log(`   - ${widget.nom} (${widget.type}, Dashboard: ${widget.tableauDeBordId})`);
    });

    // Test 7: Vérifier les exports
    console.log('\n7️⃣ Test des exports:');
    const exports = await prisma.export.findMany({
      select: { id: true, nom: true, type: true, statut: true }
    });
    console.log(`✅ ${exports.length} exports trouvés:`);
    exports.forEach(exportItem => {
      console.log(`   - ${exportItem.nom} (${exportItem.type}, Statut: ${exportItem.statut})`);
    });

    console.log('\n🎉 Tous les tests de base de données sont terminés avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du test de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();