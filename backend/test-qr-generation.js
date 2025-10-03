import { QrCodeService } from './dist/src/service/qrCodeService.js';
import { FileService } from './dist/src/service/fileService.js';

async function testQrGeneration() {
  console.log('🧪 Test de génération de QR code...');

  try {
    const qrCodeService = new QrCodeService();
    const fileService = new FileService();

    // Test 1: Générer un QR code simple
    console.log('\n📋 Test 1: Génération de QR code de base');
    const qrCodeDataURL = await qrCodeService.generateEmployeeQrCode(1, 1);
    console.log('✅ QR code généré avec succès');
    console.log(`📊 Taille: ${qrCodeDataURL.length} caractères`);

    // Test 2: Sauvegarder le fichier
    console.log('\n💾 Test 2: Sauvegarde du fichier QR code');
    const savedPath = await fileService.saveQrCodeImage(qrCodeDataURL, 1, 1);
    console.log(`✅ Fichier sauvegardé: ${savedPath}`);

    // Test 3: Vérifier que le fichier existe
    console.log('\n🔍 Test 3: Vérification de l\'existence du fichier');
    const exists = await fileService.qrCodeImageExists(savedPath);
    console.log(`✅ Fichier existe: ${exists}`);

    if (exists) {
      console.log('🎉 Tous les tests ont réussi!');
    } else {
      console.log('❌ Le fichier n\'existe pas après sauvegarde');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.error('Stack:', error.stack);
  }
}

testQrGeneration();