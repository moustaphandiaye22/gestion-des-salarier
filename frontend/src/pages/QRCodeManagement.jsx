import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '../components/ui';
import QRCodeManager from '../components/QRCodeManager';
import QRCodeScanner from '../components/QRCodeScanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { QrCodeIcon, CameraIcon } from '@heroicons/react/24/outline';
import { qrcodesApi } from '../utils/api';

export default function QRCodeManagement() {
  const { selectedCompanyId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('generate');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScanSuccess = async (qrContent) => {
    console.log('QR Code scanné:', qrContent);

    try {
      // First, scan the QR code to get employee information
      console.log('Appel API scanQrCode...');
      const scanResult = await qrcodesApi.scanQrCode(qrContent);
      console.log('Résultat API:', scanResult);

      if (scanResult.employe) {
        // Show employee information for confirmation
        setScanResult({
          success: true,
          employee: scanResult.employe,
          qrContent,
          step: 'confirm' // Show confirmation step
        });

        // Don't close scanner yet, wait for user confirmation
        return;
      } else {
        // API returned but no employee data
        setScanResult({
          success: false,
          error: 'Aucun employé trouvé pour ce QR code',
          qrContent
        });
        showError('Erreur', 'QR code non reconnu');
        setScannerOpen(false);
      }
    } catch (err) {
      console.error('Erreur lors de la lecture du QR code:', err);
      setScanResult({
        success: false,
        error: err?.response?.data?.error || err.message || 'Erreur lors de la lecture du QR code',
        qrContent
      });
      showError('Erreur', err?.response?.data?.error || 'Impossible de lire le QR code');
      setScannerOpen(false);
      return;
    }
  };

  const confirmPointage = async () => {
    if (!scanResult?.employee || !scanResult?.qrContent) return;

    try {
      // Now create the pointage
      const result = await qrcodesApi.pointerParQrCode({
        qrContent: scanResult.qrContent,
        lieu: 'Bureau via scan QR',
        ipAddress: '192.168.1.100',
        localisation: null
      });

      setScanResult({
        success: true,
        message: result.message,
        action: result.action,
        employee: scanResult.employee,
        step: 'completed'
      });

      showSuccess('Succès', `Pointage ${result.action} enregistré avec succès`);
    } catch (err) {
      console.error('Erreur lors du pointage par QR code:', err);
      setScanResult({
        success: false,
        error: err?.response?.data?.error || err.message || 'Erreur lors du pointage',
        employee: scanResult.employee,
        step: 'error'
      });
      showError('Erreur', err?.response?.data?.error || 'Impossible d\'effectuer le pointage');
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <QrCodeIcon className="h-7 w-7 text-blue-600" />
            Gestion des QR Codes
          </h1>
          <p className="mt-1 text-gray-600">
            Gérez les QR codes des employés pour un pointage rapide et sécurisé
          </p>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('generate')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'generate'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Générer QR Codes
              </button>
              <button
                onClick={() => setActiveTab('scan')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Scanner pour Pointer
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QRCodeManager entrepriseId={selectedCompanyId} />

              <Card>
                <CardHeader title="Instructions" />
                <CardBody className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Génération des QR Codes</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Sélectionnez un employé dans la liste</li>
                      <li>• Cliquez sur "Générer QR Code"</li>
                      <li>• Téléchargez et imprimez le QR code</li>
                      <li>• Distribuez le QR code à l'employé</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Utilisation</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• L'employé scanne son QR code</li>
                      <li>• Le système identifie l'employé et affiche ses informations</li>
                      <li>• Confirmation requise avant enregistrement du pointage</li>
                      <li>• Le système détecte automatiquement l'action (entrée/sortie)</li>
                      <li>• Géolocalisation automatique si disponible</li>
                      <li>• Pointage enregistré après confirmation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Sécurité</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Chaque QR code est unique à l'employé</li>
                      <li>• Les QR codes peuvent être régénérés si nécessaire</li>
                      <li>• Validation automatique de l'identité</li>
                      <li>• Traçabilité complète des actions</li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader title="Pointage par QR Code" />
                <CardBody className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                      <QrCodeIcon className="h-16 w-16 text-blue-600" />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Scanner un QR Code d'employé
                      </h3>
                      <p className="text-gray-600">
                        Utilisez la caméra pour scanner le QR code d'un employé et enregistrer automatiquement son pointage
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setScannerOpen(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <CameraIcon className="h-5 w-5" />
                    Ouvrir le scanner
                  </Button>

                  {scanResult && (
                    <div className={`p-4 rounded-lg ${
                      scanResult.success && scanResult.step === 'confirm' ? 'bg-blue-50 text-blue-800' :
                      scanResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {scanResult.step === 'confirm' && scanResult.employee ? (
                        <div className="space-y-3">
                          <p className="font-medium">👤 Employé identifié:</p>
                          <div className="bg-white p-3 rounded border">
                            <p><strong>Nom:</strong> {scanResult.employee.prenom} {scanResult.employee.nom}</p>
                            <p><strong>Matricule:</strong> {scanResult.employee.matricule}</p>
                            <p><strong>ID:</strong> {scanResult.employee.id}</p>
                          </div>
                          <p className="text-sm">Confirmer le pointage pour cet employé ?</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={confirmPointage}
                              className="flex-1"
                            >
                              Confirmer le pointage
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setScanResult(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : scanResult.step === 'completed' ? (
                        <div className="space-y-2">
                          <p className="font-medium">✅ {scanResult.message}</p>
                          <p className="text-sm">Action: {scanResult.action}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setScanResult(null)}
                          >
                            Fermer
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-medium">
                            {scanResult.success ? '✅ ' : '❌ '}
                            {scanResult.success ? scanResult.message : scanResult.error}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setScanResult(null)}
                          >
                            Fermer
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-sm text-gray-500 space-y-2">
                    <p><strong>Fonctionnement :</strong></p>
                    <ul className="text-left space-y-1">
                      <li>• Ouvrez le scanner et autorisez l'accès à la caméra</li>
                      <li>• Placez le QR code de l'employé dans le cadre</li>
                      <li>• Le système identifie l'employé et affiche ses informations</li>
                      <li>• Confirmez le pointage pour l'employé identifié</li>
                      <li>• Le pointage est enregistré (entrée ou sortie)</li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {/* Scanner modal */}
        {scannerOpen && (
          <QRCodeScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </div>
    </main>
  );
}