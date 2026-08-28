import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  Volume2
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import { checkImageQuality } from '../../utils/imageQuality';
import { aiVisionService } from '../../services/aiVisionService';
import VisualDiagnosisCard from '../cards/VisualDiagnosisCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const CropCameraModal = ({ isOpen, onClose }) => {
  const { speak } = useVoice();
  const { language, t } = useLanguage();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [qualityWarning, setQualityWarning] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  // Initialize Camera Stream on Modal Open
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    setDiagnosisResult(null);
    setQualityWarning(null);
    startCamera();

    // Voice instruction for farmer
    speak(t('cameraInstruction'));

    return () => {
      stopCamera();
    };
  }, [isOpen, language]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable. You can upload photos from your phone gallery.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Check image quality
      const quality = await checkImageQuality(blob);
      if (!quality.isValid) {
        setQualityWarning(language === 'ta' ? quality.tamilMessage : language === 'hi' ? quality.hindiMessage : quality.message);
        speak(language === 'ta' ? quality.tamilMessage : quality.message);
      } else {
        setQualityWarning(null);
      }

      setCapturedImages((prev) => [...prev.slice(0, 2), blob]); // Max 3 images
    }, 'image/jpeg', 0.9);
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const quality = await checkImageQuality(files[0]);
    if (!quality.isValid) {
      setQualityWarning(quality.message);
    } else {
      setQualityWarning(null);
    }

    setCapturedImages((prev) => [...prev, ...files].slice(0, 3));
  };

  const handleRemoveImage = (index) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
    if (capturedImages.length <= 1) {
      setQualityWarning(null);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImages.length) return;

    setIsAnalyzing(true);
    stopCamera();

    try {
      const result = await aiVisionService.analyzeCropImages(capturedImages, language);
      setDiagnosisResult(result);
      if (result.spokenText) {
        speak(result.spokenText);
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setDiagnosisResult(null);
    setCapturedImages([]);
    setQualityWarning(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-display">
                  {t('showCrop')}
                </h3>
                <p className="text-xs text-emerald-400 font-semibold">
                  {t('cameraInstruction')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body Section */}
          {isAnalyzing ? (
            <div className="py-16 text-center space-y-4">
              <LoadingSpinner message={t('analyzingImage')} />
            </div>
          ) : diagnosisResult ? (
            <div className="space-y-4">
              <VisualDiagnosisCard diagnosis={diagnosisResult} onReset={handleReset} />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Camera Viewfinder with Guiding Leaf Frame */}
              <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center">
                {cameraError ? (
                  <div className="p-6 text-center space-y-3">
                    <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                    <p className="text-sm text-slate-300">{cameraError}</p>
                    <input
                      type="file"
                      ref={galleryInputRef}
                      onChange={handleGalleryUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      variant="amber"
                      size="md"
                      icon={ImageIcon}
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      Upload from Gallery
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Guiding Leaf Target Bounding Box */}
                    <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-emerald-400 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3 bg-emerald-500/5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                        🌿 {t('cameraInstruction')}
                      </span>
                      <span className="w-12 h-12 rounded-full border border-emerald-300/40 animate-ping"></span>
                      <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-md">
                        Keep in focus
                      </span>
                    </div>
                  </>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Quality Alert if detected */}
              {qualityWarning && (
                <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>{qualityWarning}</span>
                </div>
              )}

              {/* Multi-Photo Capture Tray (Up to 3 Photos) */}
              {capturedImages.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Photos for Combined Diagnosis ({capturedImages.length}/3)
                  </p>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {capturedImages.map((blob, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-500 flex-shrink-0 group shadow-md"
                      >
                        <img
                          src={URL.createObjectURL(blob)}
                          alt={`Capture ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="primary"
                  size="xl"
                  icon={Camera}
                  onClick={handleCapturePhoto}
                  className="w-full text-base font-black shadow-xl shadow-emerald-600/40"
                >
                  {t('takePhoto')}
                </Button>

                {capturedImages.length > 0 ? (
                  <Button
                    variant="amber"
                    size="xl"
                    icon={Sparkles}
                    onClick={handleAnalyze}
                    className="w-full text-base font-black shadow-xl"
                  >
                    Scan & Diagnose
                  </Button>
                ) : (
                  <>
                    <input
                      type="file"
                      ref={galleryInputRef}
                      onChange={handleGalleryUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="xl"
                      icon={ImageIcon}
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-full text-base font-bold border-slate-600 text-white hover:bg-slate-800"
                    >
                      Gallery
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CropCameraModal;
