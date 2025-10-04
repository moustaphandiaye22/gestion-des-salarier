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
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualQRCode, setManualQRCode] = useState('');
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

      // Vérifier si getUserMedia est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia n\'est pas supporté par ce navigateur');
      }

      // Vérifier si HTTPS est utilisé (requis pour la caméra)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('HTTPS requis pour accéder à la caméra');
      }

      console.log('Demande d\'accès à la caméra...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Caméra arrière sur mobile
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 }
        }
      });

      console.log('Caméra démarrée avec succès');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Attendre que la vidéo soit chargée avant de démarrer le scanning
        videoRef.current.onloadedmetadata = () => {
          console.log('Métadonnées vidéo chargées, dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
          videoRef.current.play().then(() => {
            console.log('Vidéo démarrée avec succès');
            setIsScanning(true);
          }).catch(playError => {
            console.error('Erreur lors du démarrage de la vidéo:', playError);
            setError('Erreur lors du démarrage de la vidéo. Réessayez.');
            showError('Erreur vidéo', 'Impossible de démarrer la vidéo. Réessayez.');
          });
        };

        // Gestion d'erreur si les métadonnées ne se chargent pas
        videoRef.current.onerror = () => {
          console.error('Erreur de chargement de la vidéo');
          setError('Erreur de chargement de la vidéo. Vérifiez les permissions de la caméra.');
          showError('Erreur vidéo', 'Impossible de charger la vidéo. Vérifiez les permissions.');
        };
      }
    } catch (err) {
      console.error('Erreur d\'accès à la caméra:', err);
      let errorMessage = 'Impossible d\'accéder à la caméra. ';

      if (err.name === 'NotAllowedError') {
        errorMessage += 'Permission refusée. Autorisez l\'accès à la caméra dans les paramètres du navigateur.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Aucune caméra trouvée sur cet appareil.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'La caméra n\'est pas supportée par ce navigateur.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'La caméra est déjà utilisée par une autre application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage += 'Les contraintes de caméra sont trop élevées. Essayez avec une qualité inférieure.';
      } else if (err.name === 'SecurityError') {
        errorMessage += 'Accès à la caméra bloqué pour des raisons de sécurité. Utilisez HTTPS.';
      } else {
        errorMessage += 'Vérifiez les permissions et essayez à nouveau.';
      }

      setError(errorMessage);
      showError('Erreur caméra', errorMessage);
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

  const analyzeQRCode = async (imageData) => {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            // Créer un canvas temporaire pour analyser l'image
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
              console.error('Impossible d\'obtenir le contexte 2D');
              resolve(null);
              return;
            }

            // Ajuster la taille du canvas pour de meilleures performances
            const maxSize = 400;
            let { width, height } = img;

            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            context.drawImage(img, 0, 0, width, height);

            const imageDataObj = context.getImageData(0, 0, width, height);

            // Améliorer la détection en essayant plusieurs fois avec différents seuils
            let qrCode = jsQR(imageDataObj.data, imageDataObj.width, imageDataObj.height);

            if (qrCode) {
              console.log('QR Code détecté:', qrCode.data);
              resolve(qrCode.data);
            } else {
              resolve(null);
            }
          } catch (canvasError) {
            console.error('Erreur lors du traitement du canvas:', canvasError);
            resolve(null);
          }
        };

        img.onerror = () => {
          console.error('Erreur lors du chargement de l\'image');
          resolve(null);
        };

        img.src = imageData;
      } catch (err) {
        console.error('Erreur lors de l\'analyse du QR code:', err);
        resolve(null);
      }
    });
  };

  const scanQRCode = async () => {
    if (!isScanning) return;

    try {
      const imageData = captureFrame();
      if (imageData) {
        const qrData = await analyzeQRCode(imageData);
        if (qrData) {
          console.log('QR Code trouvé, appel du callback...');
          if (onScanSuccess) {
            onScanSuccess(qrData);
            stopCamera();
            return;
          }
        }
      }

      // Continuer à scanner avec une fréquence réduite pour de meilleures performances
      if (isScanning) {
        setTimeout(() => {
          requestAnimationFrame(scanQRCode);
        }, 200); // Scanner 5 fois par seconde pour de meilleures performances sur mobile
      }
    } catch (error) {
      console.error('Erreur lors du scanning:', error);
      if (isScanning) {
        setTimeout(() => {
          requestAnimationFrame(scanQRCode);
        }, 200);
      }
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
              <p className="mb-2">{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setError(null);
                  startCamera();
                }}
                className="text-xs"
              >
                Réessayer
              </Button>
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
                <div className="flex gap-2 justify-center">
                  <Button onClick={startCamera} className="flex items-center gap-2">
                    <CameraIcon className="h-4 w-4" />
                    Démarrer la caméra
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="flex items-center gap-2"
                  >
                    <QrCodeIcon className="h-4 w-4" />
                    Saisir manuellement
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-lg bg-black"
                    style={{
                      transform: 'scaleX(-1)', // Mirror effect for better UX
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
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

          <div className="mt-4 text-xs text-gray-500 text-center space-y-2">
            <p>Assurez-vous que la caméra a l'autorisation d'accès</p>

            {error && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs"
                >
                  {showManualInput ? 'Masquer' : 'Saisir manuellement le QR code'}
                </Button>
              </div>
            )}

            {showManualInput && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saisir le code QR manuellement
                </label>
                <input
                  type="text"
                  value={manualQRCode}
                  onChange={(e) => setManualQRCode(e.target.value)}
                  placeholder="Collez ou saisissez le contenu du QR code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (manualQRCode.trim() && onScanSuccess) {
                        onScanSuccess(manualQRCode.trim());
                        setShowManualInput(false);
                        setManualQRCode('');
                      }
                    }}
                    disabled={!manualQRCode.trim()}
                  >
                    Utiliser ce code
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowManualInput(false);
                      setManualQRCode('');
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}