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
    setLoading(true);
    try {
      // First, scan the QR code to get employee information
      const scanResult = await qrcodesApi.scanQrCode(qrContent);

      if (scanResult.employe) {
        // Show employee information for confirmation
        const confirmed = window.confirm(
          `Employé identifié: ${scanResult.employe.prenom} ${scanResult.employe.nom} (Matricule: ${scanResult.employe.matricule})\n\nConfirmer le pointage pour cet employé ?`
        );

        if (confirmed) {
          // Now create the pointage
          const result = await qrcodesApi.pointerParQrCode({
            qrContent,
            lieu: 'Bureau via QR',
            ipAddress: '192.168.1.100',
            localisation: null
          });

          showSuccess('Succès', `Pointage ${result.action} effectué avec succès`);
          onPointageCreated?.();
        }
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error || err.message || 'Erreur lors du pointage';
      showError('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
          <QrCodeIcon className="h-8 w-8 text-blue-600" />
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