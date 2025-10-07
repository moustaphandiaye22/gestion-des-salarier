import React, { useState } from "react";
import { Button } from "./ui";
import QRCodeScanner from "./QRCodeScanner";
import { useToast } from "../context/ToastContext";
import { QrCodeIcon, CameraIcon } from "@heroicons/react/24/outline";
import { qrcodesApi } from "../utils/api";

export default function PointageRapide({ onPointageCreated, className = "" }) {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Gestion du pointage par QR code
  async function handleQrCodePointage(qrContent) {
    console.log('🔍 PointageRapide - QR Code scanné:', qrContent);
    setLoading(true);

    try {
      // First, scan the QR code to get employee information
      console.log('📡 PointageRapide - Appel API scanQrCode...');
      const scanResult = await qrcodesApi.scanQrCode(qrContent);
      console.log('✅ PointageRapide - Résultat API:', scanResult);

      if (scanResult && scanResult.employe) {
        console.log('👤 PointageRapide - Employé trouvé:', scanResult.employe);

        // Show employee information for confirmation
        const confirmed = window.confirm(
          `Employé identifié: ${scanResult.employe.prenom} ${scanResult.employe.nom}\nMatricule: ${scanResult.employe.matricule}\nID: ${scanResult.employe.id}\n\nConfirmer le pointage pour cet employé ?`
        );

        if (confirmed) {
          console.log('🚀 PointageRapide - Confirmation reçue, création du pointage...');

          // Now create the pointage
          const result = await qrcodesApi.pointerParQrCode({
            qrContent,
            lieu: 'Bureau via QR rapide',
            ipAddress: '192.168.1.100',
            localisation: null
          });

          console.log('✅ PointageRapide - Pointage créé:', result);
          showSuccess('Succès', `Pointage ${result.action} effectué avec succès`);

          // Dispatch event to refresh pointages list
          window.dispatchEvent(new CustomEvent('pointageCreated', {
            detail: { action: result.action, source: 'qr' }
          }));

          onPointageCreated?.();
        } else {
          console.log('❌ PointageRapide - Pointage annulé par l\'utilisateur');
        }
      } else {
        console.error('❌ PointageRapide - Aucun employé trouvé');
        showError('Erreur', 'QR code non reconnu');
      }
    } catch (err) {
      console.error('💥 PointageRapide - Erreur lors du pointage:', err);
      const errorMessage = err?.response?.data?.error || err.message || 'Erreur lors du pointage';
      showError('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary-50 rounded-full flex items-center justify-center">
          <QrCodeIcon className="h-8 w-8 text-primary-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pointage QR Code
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Système moderne de pointage par scan QR code
          </p>
        </div>

        <Button
          onClick={() => setScannerOpen(true)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          <CameraIcon className="h-5 w-5" />
          {loading ? 'Pointage en cours...' : 'Scanner QR Code'}
        </Button>

        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Scanner QR Code */}
      {scannerOpen && (
        <QRCodeScanner
          onScanSuccess={handleQrCodePointage}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
}