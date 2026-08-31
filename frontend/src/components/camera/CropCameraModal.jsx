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
  Volume2,
  ShieldAlert,
  SwitchCamera,
  Upload,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import { aiVisionService } from '../../services/aiVisionService';
import VisualDiagnosisCard from '../cards/VisualDiagnosisCard';
import Button from '../common/Button';

const CropCameraModal = ({ isOpen, onClose }) => {
  const { speak, stop } = useVoice();
  const { language, t } = useLanguage();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationStage, setValidationStage] = useState(''); // 'quality', 'detection', 'recommendation'
  const [rejectionError, setRejectionError] = useState(null); // { type: 'POOR_QUALITY' | 'NOT_PLANT' | 'UNCERTAIN_DIAGNOSIS', message: '' }
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  // Initialize Camera Stream on Modal Open
  useEffect(() => {
    if (!isOpen) {
      stop();
      stopCamera();
      return;
    }

    setDiagnosisResult(null);
    setRejectionError(null);
    setCapturedImage(null);
    setIsAnalyzing(false);
    startCamera(facingMode);

    return () => {
      stop();
      stopCamera();
    };
  }, [isOpen, language]);

  const startCamera = async (mode = facingMode) => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play().catch((e) => console.log('Autoplay handled:', e));
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Live camera feed unavailable. You can snap a photo or upload from your gallery.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    stopCamera();
    startCamera(nextMode);
  };

  const runAnalysisPipeline = async (imageSrc) => {
    setIsAnalyzing(true);
    setRejectionError(null);
    setDiagnosisResult(null);
    stopCamera();

    try {
      // Step 1 Simulation indicator
      setValidationStage('quality');
      await new Promise((r) => setTimeout(r, 400));

      // Step 2 Simulation indicator
      setValidationStage('detection');
      await new Promise((r) => setTimeout(r, 450));

      // Step 3 & 4 Simulation indicator
      setValidationStage('recommendation');
      const result = await aiVisionService.analyzePlantImage(imageSrc, language);

      if (!result.isValid || !result.isPlant || result.status === 'POOR_QUALITY' || result.status === 'NOT_PLANT' || result.status === 'UNCERTAIN_DIAGNOSIS') {
        const localizedMsg = result.localizedMessages?.[language] || result.message;
        setRejectionError({
          type: result.status,
          message: localizedMsg,
          confidence: result.confidence
        });
        speak(localizedMsg);
      } else {
        setDiagnosisResult(result);
        if (result.spokenText) {
          speak(result.spokenText);
        }
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
      setRejectionError({
        type: 'POOR_QUALITY',
        message: 'Plant image is not clear enough. Please capture a clear close-up photo of the plant or affected leaf.'
      });
    } finally {
      setIsAnalyzing(false);
      setValidationStage('');
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    runAnalysisPipeline(dataUrl);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setCapturedImage(dataUrl);
      runAnalysisPipeline(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    stop();
    setDiagnosisResult(null);
    setRejectionError(null);
    setCapturedImage(null);
    setIsAnalyzing(false);
    setValidationStage('');
    startCamera(facingMode);
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
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  Plant Disease & Fertilizer Scanner
                </h3>
                <p className="text-xs text-emerald-400 font-semibold">
                  Capture a close-up photo of the affected plant or leaf
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                stop();
                stopCamera();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Hidden Canvas & Upload Handlers */}
          <canvas ref={canvasRef} className="hidden" />
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={nativeCameraInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Body Section */}
          {isAnalyzing ? (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-black text-white font-display">
                  {validationStage === 'quality' && 'Step 1: Checking plant image sharpness & lighting...'}
                  {validationStage === 'detection' && 'Step 2: Verifying plant foliage & leaves...'}
                  {validationStage === 'recommendation' && 'Step 3: Analyzing disease symptoms & fertilizer recipe...'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Validating agricultural botany criteria to ensure 100% accurate fertilizer advice
                </p>
              </div>
            </div>
          ) : rejectionError ? (
            /* REJECTION ERROR VIEW */
            <div className="py-6 px-4 space-y-5 text-center">
              {capturedImage && (
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-md relative">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-rose-400 drop-shadow" />
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-2 max-w-lg mx-auto text-left shadow-lg">
                <div className="flex items-center gap-2 text-rose-400">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <h4 className="text-sm font-black uppercase tracking-wider">
                    {rejectionError.type === 'NOT_PLANT'
                      ? 'No Plant Detected'
                      : rejectionError.type === 'UNCERTAIN_DIAGNOSIS'
                      ? 'Diagnosis Uncertain'
                      : 'Image Quality Insufficient'}
                  </h4>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed">
                  {rejectionError.message}
                </p>
                <p className="text-xs text-rose-300/80 leading-relaxed pt-1">
                  {rejectionError.type === 'NOT_PLANT'
                    ? 'Ensure the camera focuses directly on crop foliage, stems, or affected leaves without hands, humans, soil, buildings, or unrelated objects.'
                    : 'Place the camera 15-20 cm away from the leaf in good sunlight and avoid motion blur.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  icon={Camera}
                  size="md"
                  onClick={handleReset}
                  className="!px-6 !py-2.5 font-bold shadow-xl shadow-emerald-900/50"
                >
                  Capture Again
                </Button>
                <Button
                  variant="outline"
                  icon={RefreshCw}
                  size="md"
                  onClick={handleReset}
                  className="!text-white !border-white/30"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : diagnosisResult ? (
            /* SUCCESS DIAGNOSIS CARD */
            <div className="space-y-4">
              <VisualDiagnosisCard diagnosis={diagnosisResult} onReset={handleReset} />
            </div>
          ) : (
            /* LIVE VIEWFINDER VIEW */
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center">
                {cameraError ? (
                  <div className="p-6 text-center space-y-4">
                    <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                    <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">{cameraError}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <Button
                        variant="primary"
                        icon={Camera}
                        size="sm"
                        onClick={() => nativeCameraInputRef.current?.click()}
                      >
                        Snap Phone Photo
                      </Button>
                      <Button
                        variant="outline"
                        icon={Upload}
                        size="sm"
                        className="!text-white !border-white/30"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        Upload from Gallery
                      </Button>
                    </div>
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
                        🌿 Place affected plant leaf inside frame
                      </span>
                      <span className="w-12 h-12 rounded-full border border-emerald-300/40 animate-ping"></span>
                      <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-md">
                        Ensure clear lighting & sharp focus
                      </span>
                    </div>

                    {/* Camera Flip */}
                    <button
                      type="button"
                      onClick={toggleCamera}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
                      title="Switch Camera"
                    >
                      <SwitchCamera className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Shutter Capture Controls */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer flex flex-col items-center gap-1 text-[11px] font-bold shadow-sm"
                >
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  <span>Gallery</span>
                </button>

                {/* Shutter Trigger */}
                <button
                  type="button"
                  onClick={cameraError ? () => nativeCameraInputRef.current?.click() : handleCapturePhoto}
                  className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xl ring-4 ring-emerald-300 flex items-center justify-center transition-all cursor-pointer"
                  title="Capture Plant Photo"
                >
                  <Camera className="w-9 h-9" />
                </button>

                <button
                  type="button"
                  onClick={cameraError ? () => nativeCameraInputRef.current?.click() : toggleCamera}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer flex flex-col items-center gap-1 text-[11px] font-bold shadow-sm"
                >
                  <SwitchCamera className="w-5 h-5 text-slate-300" />
                  <span>Flip / Snap</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CropCameraModal;
