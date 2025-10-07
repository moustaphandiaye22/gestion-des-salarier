import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody } from './ui';
import { useToast } from '../context/ToastContext';
import { QrCodeIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import jsQR from 'jsqr';

export default function QRCodeScanner({ onScanSuccess, onClose, className = "" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualQRCode, setManualQRCode] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const { showSuccess, showError } = useToast();
  const animationFrameRef = useRef(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    return () => {
      stopScanning();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopScanning = () => {
    setIsScanning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startCamera = async () => {
    console.log('🚀 Démarrage de la caméra...');
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

      console.log('📹 Demande d\'accès à la caméra...');
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Caméra autorisée, stream obtenu');

      // IMPORTANT: Démarrer le scanning AVANT d'accéder à l'élément vidéo
      // pour que l'élément vidéo soit rendu dans le DOM
      setIsScanning(true);

      // Attendre un court instant pour que l'élément vidéo soit rendu
      await new Promise(resolve => setTimeout(resolve, 100));

      if (videoRef.current) {
        console.log('🎬 Assignation du stream à l\'élément vidéo...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Attendre que la vidéo soit prête
        await new Promise((resolve, reject) => {
          const video = videoRef.current;

          const onLoadedMetadata = () => {
            console.log('📐 Métadonnées chargées:', video.videoWidth, 'x', video.videoHeight);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            resolve();
          };

          const onError = (e) => {
            console.error('❌ Erreur vidéo:', e);
            video.removeEventListener('error', onError);
            reject(new Error('Erreur de chargement vidéo'));
          };

          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);

          // Timeout de sécurité
          setTimeout(() => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Timeout lors du chargement vidéo'));
          }, 10000);
        });

        // Démarrer la lecture
        console.log('▶️ Démarrage de la lecture vidéo...');
        await videoRef.current.play();
        console.log('✅ Vidéo en cours de lecture');
      } else {
        // Si l'élément vidéo n'est toujours pas trouvé, arrêter le scanning
        setIsScanning(false);
        throw new Error('Élément vidéo non trouvé - veuillez réessayer');
      }
    } catch (err) {
      console.error('💥 Erreur d\'accès à la caméra:', err);
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
        errorMessage += 'Les contraintes de caméra sont trop élevées.';
      } else if (err.name === 'SecurityError') {
        errorMessage += 'Accès à la caméra bloqué pour des raisons de sécurité.';
      } else {
        errorMessage += err.message || 'Vérifiez les permissions et essayez à nouveau.';
      }

      setError(errorMessage);
      showError('Erreur caméra', errorMessage);
    }
  };

  const stopCamera = () => {
    console.log('🛑 Arrêt de la caméra...');
    stopScanning();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('🛑 Arrêt de la piste:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    console.log('✅ Caméra arrêtée');
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  };

  const analyzeQRCode = async (imageData) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      return new Promise((resolve) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { willReadFrequently: true });

            if (!context) {
              console.error('Impossible d\'obtenir le contexte 2D');
              resolve(null);
              return;
            }

            const maxSize = 600;
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

            let qrCode = jsQR(imageDataObj.data, imageDataObj.width, imageDataObj.height);

            if (qrCode && qrCode.data) {
              console.log('🎯 QR Code détecté:', qrCode.data);
              resolve(qrCode.data);
            } else {
              resolve(null);
            }
          } catch (canvasError) {
            console.error('Erreur lors du traitement du canvas:', canvasError);
            resolve(null);
          }
        };

        img.onerror = (error) => {
          console.error('Erreur lors du chargement de l\'image:', error);
          resolve(null);
        };

        img.src = imageData;
      });
    } catch (err) {
      console.error('Erreur lors de l\'analyse du QR code:', err);
      return null;
    }
  };

  const scanQRCode = async () => {
    if (!isScanning) return;

    // Skip frames to reduce CPU usage (process every 3rd frame)
    frameCountRef.current++;
    if (frameCountRef.current % 3 !== 0) {
      if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
      }
      return;
    }

    try {
      const imageData = captureFrame();
      if (imageData) {
        const qrData = await analyzeQRCode(imageData);
        if (qrData) {
          console.log('🎯 QR Code trouvé, arrêt du scanning');
          showSuccess('QR Code scanné', 'Code détecté avec succès !');
          stopCamera();

          if (onScanSuccess) {
            onScanSuccess(qrData);
          }
          return;
        }
      }

      if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
      }
    } catch (error) {
      console.error('❌ Erreur lors du scanning:', error);
      if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
      }
    }
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessingImage(true);
    console.log('📁 Traitement du fichier image...');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        console.log('🔍 Analyse du QR code dans l\'image...');
        const qrData = await analyzeQRCode(dataUrl);

        if (qrData) {
          console.log('✅ QR Code trouvé dans l\'image:', qrData);
          showSuccess('QR Code scanné', 'Code détecté avec succès dans l\'image !');
          if (onScanSuccess) {
            onScanSuccess(qrData);
          }
        } else {
          console.log('❌ Aucun QR code détecté dans l\'image');
          showError('Erreur', 'Aucun QR code détecté dans l\'image.');
        }
        setIsProcessingImage(false);
      };

      reader.onerror = () => {
        console.error('Erreur lors de la lecture du fichier');
        showError('Erreur', 'Erreur lors de la lecture du fichier.');
        setIsProcessingImage(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Erreur lors du traitement de l\'image:', err);
      showError('Erreur', 'Erreur lors du traitement de l\'image.');
      setIsProcessingImage(false);
    }
  };

  useEffect(() => {
    if (isScanning) {
      console.log('🔄 Démarrage du cycle de scanning');
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isScanning]);

  return (
    <div className={`fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5 text-primary-600" />
              Scanner QR Code
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                stopCamera();
                onClose();
              }}
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
                <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <QrCodeIcon className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Positionnez le QR code de l'employé dans le cadre pour scanner
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    onClick={startCamera}
                    className="flex items-center gap-2"
                  >
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
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="flex items-center gap-2"
                  >
                    📁 {isProcessingImage ? 'Traitement...' : 'Importer une image'}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{
                      transform: 'scaleX(-1)',
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                    <div className="absolute inset-2 border-2 border-white/50 rounded-lg flex items-center justify-center">
                      <div className="w-24 h-24 border-2 border-primary-500 rounded-lg bg-white/10"></div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (manualQRCode.trim() && onScanSuccess) {
                        onScanSuccess(manualQRCode.trim());
                        setShowManualInput(false);
                        setManualQRCode('');
                        stopCamera();
                        onClose();
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
