import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody } from './ui';
import { useToast } from '../context/ToastContext';
import { QrCodeIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import jsQR from 'jsqr';

export default function QRCodeScanner({ onScanSuccess, onClose, className = "" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    return () => {
      // Nettoyer le stream vidéo lors du démontage
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Caméra arrière sur mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Erreur d\'accès à la caméra:', err);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      showError('Erreur caméra', 'Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  };

  const analyzeQRCode = (imageData) => {
    try {
      const img = new Image();
      img.onload = () => {
        // Créer un canvas temporaire pour analyser l'image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageDataObj = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageDataObj.data, imageDataObj.width, imageDataObj.height);

        if (qrCode) {
          console.log('QR Code détecté:', qrCode.data);
          if (onScanSuccess) {
            onScanSuccess(qrCode.data);
            stopCamera();
          }
        }
      };
      img.src = imageData;
    } catch (err) {
      console.error('Erreur lors de l\'analyse du QR code:', err);
    }
  };

  const scanQRCode = () => {
    if (!isScanning) return;

    const imageData = captureFrame();
    if (imageData) {
      analyzeQRCode(imageData);
    }

    // Continuer à scanner
    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  useEffect(() => {
    if (isScanning) {
      scanQRCode();
    }
  }, [isScanning]);

  return (
    <div className={`fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5 text-blue-600" />
              Scanner QR Code
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isScanning ? (
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCodeIcon className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Positionnez le QR code de l'employé dans le cadre pour scanner
                </p>
                <Button onClick={startCamera} className="flex items-center gap-2">
                  <CameraIcon className="h-4 w-4" />
                  Démarrer la caméra
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  {/* Overlay pour indiquer la zone de scan */}
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                    <div className="w-full h-full border-2 border-white/50 rounded-lg flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-blue-500 rounded-lg"></div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Placez le QR code dans le cadre pour le scanner
                </p>
                <Button
                  variant="outline"
                  onClick={stopCamera}
                  className="flex items-center gap-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Arrêter la caméra
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Assurez-vous que la caméra a l'autorisation d'accès
          </div>
        </CardBody>
      </Card>
    </div>
  );
}