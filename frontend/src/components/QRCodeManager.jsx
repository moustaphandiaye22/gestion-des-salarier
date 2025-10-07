import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Input, Select } from './ui';
import { useToast } from '../context/ToastContext';
import { QrCodeIcon, ArrowDownTrayIcon, PlusIcon } from '@heroicons/react/24/outline';
import { employesApi, qrcodesApi } from '../utils/api';

export default function QRCodeManager({ employeId, entrepriseId, className = "" }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [employes, setEmployes] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState(employeId || '');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadEmployes();
    if (employeId) {
      loadQrCode(employeId);
    }
  }, [employeId]);

  async function loadEmployes() {
    try {
      const employesList = await employesApi.list();
      setEmployes(employesList);
    } catch (err) {
      console.error('Erreur lors du chargement des employés:', err);
      showError('Erreur', 'Impossible de charger la liste des employés');
    }
  }

  async function loadQrCode(empId) {
    setLoading(true);
    try {
      // Récupérer les informations du QR code
      const qrInfo = await qrcodesApi.getQrCodeInfo(empId);

      if (qrInfo.employe.hasQrCode) {
        // Récupérer l'image du QR code
        const qrImageBlob = await qrcodesApi.getQrCodeImage(empId);
        const qrImageUrl = URL.createObjectURL(qrImageBlob);

        setQrCode({
          qrCode: qrImageUrl,
          qrContent: qrInfo.employe.qrCode || 'Non disponible',
          employe: {
            id: qrInfo.employe.id,
            nom: qrInfo.employe.nom,
            prenom: qrInfo.employe.prenom,
            matricule: qrInfo.employe.matricule
          }
        });
      } else {
        setQrCode(null);
      }
    } catch (err) {
      console.error('Erreur lors du chargement du QR code:', err);
      showError('Erreur', 'Impossible de charger le QR code');
      setQrCode(null);
    } finally {
      setLoading(false);
    }
  }

  async function generateQrCode() {
    if (!selectedEmploye) {
      showError('Erreur', 'Veuillez sélectionner un employé');
      return;
    }

    setGenerating(true);
    try {
      await qrcodesApi.generateQrCode(selectedEmploye);
      showSuccess('Succès', 'QR code généré avec succès');
      await loadQrCode(selectedEmploye);
    } catch (err) {
      console.error('Erreur lors de la génération du QR code:', err);
      showError('Erreur', err?.response?.data?.error || 'Impossible de générer le QR code');
    } finally {
      setGenerating(false);
    }
  }

  async function regenerateQrCode() {
    if (!selectedEmploye) {
      showError('Erreur', 'Veuillez sélectionner un employé');
      return;
    }

    setGenerating(true);
    try {
      await qrcodesApi.regenerateQrCode(selectedEmploye);
      showSuccess('Succès', 'QR code régénéré avec succès');
      await loadQrCode(selectedEmploye);
    } catch (err) {
      console.error('Erreur lors de la régénération du QR code:', err);
      showError('Erreur', err?.response?.data?.error || 'Impossible de régénérer le QR code');
    } finally {
      setGenerating(false);
    }
  }

  async function downloadQrCode() {
    if (!qrCode || !selectedEmploye) return;

    try {
      // Récupérer l'image du QR code depuis le serveur
      const qrImageBlob = await qrcodesApi.getQrCodeImage(selectedEmploye);
      const qrImageUrl = URL.createObjectURL(qrImageBlob);

      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = `qr-code-${qrCode.employe.prenom}-${qrCode.employe.nom}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer l'URL blob
      URL.revokeObjectURL(qrImageUrl);

      showSuccess('Succès', 'QR code téléchargé avec succès');
    } catch (err) {
      console.error('Erreur lors du téléchargement du QR code:', err);
      showError('Erreur', 'Impossible de télécharger le QR code');
    }
  }

  return (
    <Card className={className}>
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <QrCodeIcon className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Gestion des QR Codes
          </h3>
        </div>

        <div className="space-y-4">
          {/* Sélection d'employé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employé
            </label>
            <Select
              value={selectedEmploye}
              onChange={(e) => {
                setSelectedEmploye(e.target.value);
                if (e.target.value) {
                  loadQrCode(e.target.value);
                } else {
                  setQrCode(null);
                }
              }}
              className="w-full"
            >
              <option value="">Sélectionner un employé</option>
              {employes.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.prenom} {emp.nom} ({emp.matricule})
                </option>
              ))}
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={generateQrCode}
              disabled={generating || !selectedEmploye}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              {generating ? 'Génération...' : 'Générer QR Code'}
            </Button>

            {qrCode && (
              <Button
                variant="outline"
                onClick={regenerateQrCode}
                disabled={generating}
                className="flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Régénérer
              </Button>
            )}
          </div>

          {/* Affichage du QR Code */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Chargement du QR code...</p>
            </div>
          )}

          {qrCode && !loading && (
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-white border rounded-lg">
                <img
                  src={qrCode.qrCode}
                  alt="QR Code employé"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Employé:</strong> {qrCode.employe.prenom} {qrCode.employe.nom}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Matricule:</strong> {qrCode.employe.matricule}
                </p>
                <p className="text-xs text-gray-500 break-all">
                  <strong>Code:</strong> {qrCode.qrContent}
                </p>
              </div>

              <Button
                onClick={downloadQrCode}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Télécharger QR Code
              </Button>
            </div>
          )}

          {!qrCode && !loading && selectedEmploye && (
            <div className="text-center py-8 text-gray-500">
              <QrCodeIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Aucun QR code généré pour cet employé</p>
              <p className="text-sm">Cliquez sur "Générer QR Code" pour créer un QR code</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Comment utiliser les QR Codes :
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Imprimez le QR code et donnez-le à l'employé</li>
              <li>• L'employé peut scanner son QR code pour pointer</li>
              <li>• Le système détecte automatiquement l'entrée ou la sortie</li>
              <li>• Géolocalisation automatique si disponible</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}