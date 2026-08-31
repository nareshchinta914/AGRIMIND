import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  Upload,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Sparkles,
  Volume2,
  Sprout,
  Droplets,
  Layers,
  TrendingUp,
  RefreshCw,
  Info,
  SwitchCamera,
  Image as ImageIcon,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { analyzeSoilImage } from '../../services/soilAnalysisService';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../common/Button';

const SoilScannerModal = ({ isOpen, onClose }) => {
  const { speak, stop } = useVoice();
  const { language, t } = useLanguage();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationStage, setValidationStage] = useState(''); // 'quality', 'detection', 'recommendation'
  const [analysisResult, setAnalysisResult] = useState(null);

  // Initialize live camera stream on modal open
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    setCapturedImage(null);
    setAnalysisResult(null);
    setCameraError(null);
    setValidationStage('');
    startCamera(facingMode);

    // Spoken voice guidance
    if (language === 'ta') {
      speak('உங்கள் நிலத்து மண்ணை கேமராவுக்குள் காட்டி புகைப்படம் எடுக்கவும்.');
    } else if (language === 'te') {
      speak('మీ పొలంలోని మట్టిని కెమెరాలో ఉంచి ఫోటో తీయండి.');
    } else if (language === 'hi') {
      speak('अपने खेत की मिट्टी को कैमरे के सामने रखें और फोटो खींचे।');
    } else {
      speak('Keep the farm soil inside the camera frame and tap capture.');
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, language]);

  const startCamera = async (mode = 'environment') => {
    stopCamera();
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play().catch((e) => console.log('Autoplay handled:', e));
      }
    } catch (err) {
      console.warn('Live camera access unavailable:', err);
      setCameraError('Live camera stream unavailable on this browser. You can take a photo using your phone camera or upload an image.');
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
  };

  // Process and analyze image with multi-step validation
  const runSoilAnalysis = async (imageSrc) => {
    setIsAnalyzing(true);
    setValidationStage('quality');

    try {
      // Small simulated tick for responsive stage visualization
      await new Promise((r) => setTimeout(r, 300));
      setValidationStage('detection');

      const result = await analyzeSoilImage(imageSrc);
      setAnalysisResult(result);

      // Voice read-out strictly in the user's selected language
      if (!result.isValid || !result.isSoil) {
        const voiceError = result.localizedMessages?.[language] || result.message;
        speak(voiceError, language);
      } else {
        const profile = result.profile;
        const soilName = profile.name[language] || profile.name['en'];
        const topCrop = profile.recommendedCrops[0];
        const cropName = topCrop.name[language] || topCrop.name['en'];

        if (language === 'ta') {
          speak(`மண் உறுதிசெய்யப்பட்டது. இது ${soilName}. பரிந்துரைக்கப்பட்ட முதன்மை பயிர் ${cropName}. எதிர்பார்க்கப்படும் மகசூல்: ${topCrop.expectedYield}.`);
        } else if (language === 'te') {
          speak(`నేల నిర్ధారించబడింది. ఇది ${soilName}. అనువైన పంట ${cropName}. దిగుబడి: ${topCrop.expectedYield}.`);
        } else if (language === 'hi') {
          speak(`मिट्टी की पुष्टि हुई। यह ${soilName} है। अनुशंसित फसल ${cropName} है। पैदावार: ${topCrop.expectedYield}।`);
        } else {
          speak(`Soil verified. Detected: ${soilName}. Top recommended crop is ${cropName} with expected yield ${topCrop.expectedYield}.`);
        }
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult({
        isValid: false,
        isSoil: false,
        status: 'POOR_QUALITY',
        message: 'Image is not clear enough. Please capture a clear photo of the soil and try again.'
      });
    } finally {
      setIsAnalyzing(false);
      setValidationStage('');
    }
  };

  // Live Shutter Photo Capture
  const handleCaptureLivePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    runSoilAnalysis(dataUrl);
  };

  // Gallery File Upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCapturedImage(dataUrl);
      stopCamera();
      runSoilAnalysis(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    stop();
    setCapturedImage(null);
    setAnalysisResult(null);
    setValidationStage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    startCamera(facingMode);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                🌱
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-white">
                  Soil Scanner & Crop Recommendation
                </h3>
                <p className="text-xs text-emerald-400 font-bold">
                  Stage 1: Quality Check • Stage 2: Soil Detection • Stage 3: Crop Match
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
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Hidden canvas & file upload input */}
            <canvas ref={canvasRef} className="hidden" />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              type="file"
              ref={nativeCameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* VIEW 1: LIVE CAMERA VIEWFINDER */}
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center">
                  {cameraError ? (
                    <div className="p-6 text-center space-y-4 text-white">
                      <Camera className="w-12 h-12 text-emerald-400 mx-auto" />
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
                          onClick={() => fileInputRef.current?.click()}
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

                      {/* Viewfinder Targeting Frame */}
                      <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/80 rounded-3xl pointer-events-none flex flex-col justify-between p-3">
                        <div className="flex justify-between">
                          <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
                          <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
                        </div>
                        <div className="text-center bg-black/50 backdrop-blur-sm py-1.5 px-3.5 rounded-full text-[11px] font-bold text-white max-w-xs mx-auto border border-white/10">
                          📍 Place clear, unobstructed farm soil inside frame
                        </div>
                        <div className="flex justify-between">
                          <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
                          <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>
                        </div>
                      </div>

                      {/* Camera Switch Button */}
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
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex flex-col items-center gap-1 text-[11px] font-bold shadow-sm"
                  >
                    <ImageIcon className="w-5 h-5 text-emerald-700" />
                    <span>Gallery</span>
                  </button>

                  {/* Giant Live Shutter Trigger */}
                  <button
                    type="button"
                    onClick={cameraError ? () => nativeCameraInputRef.current?.click() : handleCaptureLivePhoto}
                    className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xl ring-4 ring-emerald-300 flex items-center justify-center transition-all cursor-pointer"
                    title="Capture Soil Photo"
                  >
                    <Camera className="w-9 h-9" />
                  </button>

                  <button
                    type="button"
                    onClick={cameraError ? () => nativeCameraInputRef.current?.click() : toggleCamera}
                    className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex flex-col items-center gap-1 text-[11px] font-bold shadow-sm"
                  >
                    <SwitchCamera className="w-5 h-5 text-slate-700" />
                    <span>Flip / Snap</span>
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW 2: CAPTURED IMAGE & LIVE SOIL VALIDATION RESULTS */
              <div className="space-y-6">
                {/* Captured Image Strip */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={capturedImage}
                    alt="Captured Soil Sample"
                    className="w-28 h-28 object-cover rounded-2xl border-2 border-slate-300 shadow-md"
                  />
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <span className="text-xs font-bold text-slate-500 uppercase">Captured Image</span>
                    <h4 className="text-base font-black text-slate-900 font-display">
                      Soil Image Evaluation
                    </h4>
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Retake / Capture Again</span>
                    </button>
                  </div>
                </div>

                {/* Validation Loading Spinner */}
                {isAnalyzing && (
                  <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-3xl border border-emerald-200">
                    <Sparkles className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                    <h4 className="text-base font-black text-emerald-950 font-display">
                      {validationStage === 'quality'
                        ? 'Step 1: Checking image resolution, lighting & blur...'
                        : 'Step 2: Verifying agricultural soil & analyzing texture...'}
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Validating whether the image contains clearly visible agricultural soil...
                    </p>
                  </div>
                )}

                {/* REJECTION STATE: POOR QUALITY, NOT SOIL, OR INSUFFICIENT SOIL */}
                {analysisResult && (!analysisResult.isValid || !analysisResult.isSoil) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 space-y-4 text-center sm:text-left shadow-lg"
                  >
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        {analysisResult.status === 'POOR_QUALITY' ? (
                          <AlertTriangle className="w-7 h-7" />
                        ) : (
                          <AlertOctagon className="w-7 h-7" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-rose-950 font-display">
                          {analysisResult.status === 'POOR_QUALITY'
                            ? 'Image Quality Issue'
                            : analysisResult.status === 'INSUFFICIENT_SOIL'
                            ? 'Insufficient Soil Information'
                            : 'Not Agricultural Soil'}
                        </h3>
                        <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                          Crop recommendation withheld
                        </span>
                      </div>
                    </div>

                    {/* Standard Exact Message */}
                    <div className="p-4 bg-white rounded-2xl border border-rose-200 text-xs sm:text-sm text-rose-950 font-bold leading-relaxed shadow-sm">
                      <p>
                        {analysisResult.localizedMessages?.[language] || analysisResult.message}
                      </p>
                      {analysisResult.status === 'NOT_SOIL' && (
                        <p className="text-xs text-slate-500 font-normal mt-1 pt-1 border-t border-slate-100">
                          (Rejected: humans, leaves, animals, buildings, roads, vehicles, sky, water, food, screens or unrelated objects).
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center sm:justify-start pt-1">
                      <Button
                        variant="primary"
                        icon={Camera}
                        onClick={handleRetake}
                        className="!bg-rose-600 hover:!bg-rose-700 shadow-lg shadow-rose-600/30 font-black text-xs sm:text-sm"
                      >
                        Retake / Capture Again
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* SUCCESS STATE: VALID SOIL WITH ACCURATE RECOMMENDATIONS */}
                {analysisResult && analysisResult.isValid && analysisResult.isSoil && analysisResult.profile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-5 rounded-3xl bg-emerald-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-white text-emerald-700 flex items-center justify-center font-bold text-2xl shadow-inner">
                          ✅
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                            Valid Farm Soil Detected
                          </span>
                          <h3 className="text-xl font-black font-display text-white mt-0.5">
                            {analysisResult.profile.name[language] || analysisResult.profile.name['en']}
                          </h3>
                          <p className="text-xs text-emerald-100/90 mt-0.5">
                            {analysisResult.profile.texture[language] || analysisResult.profile.texture['en']}
                          </p>
                        </div>
                      </div>

                      {analysisResult.confidence && (
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-700 text-emerald-100 text-xs font-black flex-shrink-0">
                          Confidence: {analysisResult.confidence}%
                        </span>
                      )}
                    </div>

                    {/* Agronomic Explanation */}
                    {analysisResult.profile.explanation && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
                        <strong>Soil Agronomic Analysis: </strong>
                        {analysisResult.profile.explanation[language] || analysisResult.profile.explanation['en']}
                      </div>
                    )}

                    {/* Soil Chemical Properties Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-500">pH Level</span>
                        <div className="text-lg font-black text-slate-900 font-display">{analysisResult.profile.ph}</div>
                        <span className="text-[10px] text-emerald-700 font-bold block">{analysisResult.profile.phStatus}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-500">Carbon (OC)</span>
                        <div className="text-lg font-black text-slate-900 font-display">{analysisResult.profile.organicCarbon}</div>
                        <span className="text-[10px] text-slate-500 font-bold block">Organic Matter</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-500">Nitrogen (N)</span>
                        <div className="text-lg font-black text-slate-900 font-display">{analysisResult.profile.nitrogen.split(' ')[0]}</div>
                        <span className="text-[10px] text-slate-500 font-bold block">{analysisResult.profile.nitrogen.split(' ')[1]}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-500">Potassium (K)</span>
                        <div className="text-lg font-black text-slate-900 font-display">{analysisResult.profile.potassium.split(' ')[0]}</div>
                        <span className="text-[10px] text-slate-500 font-bold block">{analysisResult.profile.potassium.split(' ')[1]}</span>
                      </div>
                    </div>

                    {/* Recommended Crops */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>Recommended High-Yield Crops for Your Soil</span>
                      </h4>

                      {analysisResult.profile.recommendedCrops.map((crop, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-black text-slate-900">
                              {crop.name[language] || crop.name['en']} ({crop.variety})
                            </h5>
                            <span className="text-xs font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
                              {crop.suitability}% Match
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                            <div><strong>Expected Yield:</strong> {crop.expectedYield}</div>
                            <div><strong>Est. Profit:</strong> {crop.profit}</div>
                          </div>

                          <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-emerald-100">
                            <strong>Fertilizer Dosage:</strong> {crop.fertilizer}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        variant="outline"
                        icon={RefreshCw}
                        size="sm"
                        onClick={handleRetake}
                      >
                        Scan Another Soil Sample
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SoilScannerModal;
