import { EmployeService } from './backend/src/service/employeService.js';

async function testQrScan() {
  console.log('🧪 Test du scanner QR code avec matricule "DW25050"');

  const employeService = new EmployeService();

  try {
    console.log('🔍 Recherche de l\'employé avec QR code/matricule: DW25050');
    const employe = await employeService.getEmployeByQrCode('DW25050');

    console.log('✅ Employé trouvé !');
    console.log('👤 Informations de l\'employé:');
    console.log(`   - ID: ${employe.id}`);
    console.log(`   - Nom: ${employe.prenom} ${employe.nom}`);
    console.log(`   - Matricule: ${employe.matricule}`);
    console.log(`   - Entreprise: ${employe.entreprise.nom}`);
    console.log(`   - Statut: ${employe.statutEmploi}`);

    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la recherche:', error.message);
    return false;
  }
}

// Test avec un QR code système valide
async function testSystemQrCode() {
  console.log('\n🧪 Test du scanner QR code avec QR code système');

  const employeService = new EmployeService();

  try {
    // Générer un QR code système pour tester
    const employes = await employeService.getAllEmployes();
    if (employes.length > 0) {
      const testEmploye = employes[0];
      console.log(`🔍 Test avec l'employé: ${testEmploye.prenom} ${testEmploye.nom} (${testEmploye.matricule})`);

      if (testEmploye.qrCode) {
        console.log(`🔍 Recherche avec QR code système: ${testEmploye.qrCode}`);
        const employe = await employeService.getEmployeByQrCode(testEmploye.qrCode);

        console.log('✅ Employé trouvé avec QR code système !');
        console.log(`👤 ${employe.prenom} ${employe.nom} (${employe.matricule})`);
        return true;
      } else {
        console.log('⚠️ Cet employé n\'a pas de QR code système généré');
        return false;
      }
    } else {
      console.log('⚠️ Aucun employé trouvé dans la base de données');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors du test QR code système:', error.message);
    return false;
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🚀 Démarrage des tests du scanner QR code\n');

  const matriculeTest = await testQrScan();
  const qrCodeTest = await testSystemQrCode();

  console.log('\n📊 Résultats des tests:');
  console.log(`   - Test matricule "DW25050": ${matriculeTest ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`);
  console.log(`   - Test QR code système: ${qrCodeTest ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`);

  if (matriculeTest) {
    console.log('\n🎉 Le problème du scanner QR code est résolu !');
    console.log('   Le système peut maintenant reconnaître les matricules directement.');
  } else {
    console.log('\n⚠️ Le problème persiste. Vérifiez les données de test.');
  }
}

runTests().catch(console.error);
