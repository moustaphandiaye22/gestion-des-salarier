import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Table, Button } from "../components/ui";
import PointageRapide from "../components/PointageRapide";
import QRCodeManager from "../components/QRCodeManager";
import QRCodeScanner from "../components/QRCodeScanner";
import { pointagesApi, qrcodesApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { ClockIcon, UserIcon, MapPinIcon, QrCodeIcon, CameraIcon } from "@heroicons/react/24/outline";

export default function VigileDashboard() {
  const [pointages, setPointages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const { user, selectedCompanyId } = useAuth();

  async function loadPointages() {
    setLoading(true);
    setError(null);
    try {
      const data = await pointagesApi.list();
      // Show recent pointages (last 20)
      setPointages(data.slice(0, 20));
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPointages();
  }, []);

  // Listen for pointage creation events
  useEffect(() => {
    const handlePointageCreated = () => {
      loadPointages();
    };

    window.addEventListener('pointageCreated', handlePointageCreated);

    return () => {
      window.removeEventListener('pointageCreated', handlePointageCreated);
    };
  }, []);

  const handleScanSuccess = async (qrContent) => {
    console.log('🔍 QR Code scanné:', qrContent);

    try {
      const scanResult = await qrcodesApi.scanQrCode(qrContent);
      console.log('Résultat API:', scanResult);

      if (scanResult && scanResult.employe) {
        setScanResult({
          success: true,
          employee: scanResult.employe,
          qrContent,
          step: 'confirm'
        });
        return;
      } else {
        setScanResult({
          success: false,
          error: 'Aucun employé trouvé pour ce QR code',
          qrContent
        });
        setScannerOpen(false);
      }
    } catch (err) {
      console.error('Erreur lors de la lecture du QR code:', err);
      setScanResult({
        success: false,
        error: err?.response?.data?.error || err.message || 'Erreur lors de la lecture du QR code',
        qrContent
      });
      setScannerOpen(false);
    }
  };

  const confirmPointage = async () => {
    if (!scanResult?.employee || !scanResult?.qrContent) return;

    try {
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

      // Dispatch event to refresh pointages list
      window.dispatchEvent(new CustomEvent('pointageCreated', {
        detail: { action: result.action, source: 'vigile-dashboard' }
      }));
    } catch (err) {
      setScanResult({
        success: false,
        error: err?.response?.data?.error || err.message || 'Erreur lors du pointage',
        employee: scanResult.employee,
        step: 'error'
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Vigile</h1>
          <p className="text-gray-600">Gestion des pointages et surveillance des accès</p>
        </div>

        {error && <div className="mb-4 rounded bg-red-50 p-3 ring-1 ring-red-200 text-sm text-red-800">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pointage Rapide */}
          <Card>
            <CardHeader title="Pointage Rapide" />
            <CardBody>
              <PointageRapide onPointageCreated={loadPointages} />
            </CardBody>
          </Card>

          {/* Statistiques du jour */}
          <Card>
            <CardHeader title="Statistiques du jour" />
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Présences aujourd'hui</p>
                    <p className="text-xs text-green-600">
                      {pointages.filter(p => p.datePointage === new Date().toISOString().split('T')[0]).length} employés
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total pointages</p>
                    <p className="text-xs text-blue-600">{pointages.length} enregistrements</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">Lieu principal</p>
                    <p className="text-xs text-orange-600">Bureau central</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Liste des pointages récents */}
        <Card>
          <CardHeader title="Pointages récents" />
          <CardBody>
            <div className="max-h-96 overflow-y-auto">
              <Table
                head={["Employé", "Date/Heure", "Type", "Statut", "Lieu"]}
                rows={pointages}
                renderRow={(row) => (
                  <tr key={row.id}>
                    <td className="px-2 py-2 text-sm text-gray-900 font-medium">
                      {row.employe?.prenom} {row.employe?.nom}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.datePointage ? new Date(row.datePointage).toLocaleDateString() : '-'}
                      {row.heureEntree ? ` ${new Date(row.heureEntree).toLocaleTimeString()}` : ''}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.typePointage || 'PRESENCE'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.statut === 'PRESENT' ? 'bg-green-100 text-green-800' :
                        row.statut === 'ABSENT' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.statut || 'EN_ATTENTE'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-700">
                      {row.lieu || '-'}
                    </td>
                  </tr>
                )}
              />
            </div>
            {pointages.length === 0 && !loading && <p className="text-sm text-gray-500 mt-4">Aucun pointage récent</p>}
          </CardBody>
        </Card>

        {/* Section QR Codes */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <QrCodeIcon className="h-6 w-6 text-primary-600" />
            Gestion des QR Codes
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Génération QR Codes */}
            <Card>
              <CardHeader title="Génération QR Codes" />
              <CardBody>
                <QRCodeManager entrepriseId={selectedCompanyId} />
              </CardBody>
            </Card>

            {/* Scanner QR Codes */}
            <Card>
              <CardHeader title="Pointage par QR Code" />
              <CardBody className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                    <QrCodeIcon className="h-12 w-12 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Scanner un QR Code d'employé
                    </h3>
                    <p className="text-gray-600 text-sm">
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
        </div>

        {loading && <p className="mt-8 text-sm text-gray-600 text-center">Chargement...</p>}

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
