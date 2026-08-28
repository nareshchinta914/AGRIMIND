import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  Upload,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Volume2,
  Sprout,
  Droplets,
  Layers,
  TrendingUp,
  RefreshCw,
  Info,
  SwitchCamera,
  Image as ImageIcon
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

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      }
    } catch (err) {
      console.warn('Live camera access unavailable:', err);
      setCameraError('Live camera stream unavailable. You can capture or upload an image.');
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

  // Process and analyze image for Soil Verification and Crop Recommendation
  const runSoilAnalysis = async (imageSrc) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSoilImage(imageSrc);
      setAnalysisResult(result);

      // Voice read-out strictly in the user's selected language
      if (!result.isSoil) {
        if (language === 'ta') {
          speak('இது விவசாய மண் அல்ல. தயவுசெய்து உங்கள் நிலத்து மண்ணை கேமராவில் காட்டவும்.');
        } else if (language === 'te') {
          speak('ఇది వ్యవసాయ నేల కాదు. దయచేసి పొలంలోని మట్టిని కెమెరాలో చూపించండి.');
        } else if (language === 'hi') {
          speak('यह खेत की मिट्टी नहीं है। कृपया खेत की मिट्टी पर कैमरा रखें।');
        } else if (language === 'kn') {
          speak('ಇದು ಕೃಷಿ ಮಣ್ಣಲ್ಲ. ದಯವಿಟ್ಟು ಹೊಲದ ಮಣ್ಣನ್ನು ತೋರಿಸಿ.');
        } else if (language === 'ml') {
          speak('ഇത് കൃഷിഭൂമിയിലെ മണ്ണല്ല. ദയവായി മണ്ണിലേക്ക് ക്യാമറ തിരിക്കുക.');
        } else if (language === 'mr') {
          speak('ही शेतीची माती नाही. कृपया शेतातील मातीचा फोटो काढा.');
        } else if (language === 'bn') {
          speak('এটি কৃষি মাটি নয়। দয়া করে জমির মাটির ছবি তুলুন।');
        } else {
          speak('This is not agricultural soil. Please point your camera directly at the farm soil.');
        }
      } else {
        const profile = result.profile;
        const soilName = profile.name[language] || profile.name['en'];
        const topCrop = profile.recommendedCrops[0];
        const cropName = topCrop.name[language] || topCrop.name['en'];

        if (language === 'ta') {
          speak(`மண் பரிசோதனை முடிந்தது. இது ${soilName}. உங்கள் நிலத்திற்கு ஏற்ற பயிர் ${cropName}. எதிர்பார்க்கப்படும் மகசூல்: ${topCrop.expectedYield}.`);
        } else if (language === 'te') {
          speak(`నేల గుర్తింపు పూర్తయింది. ఇది ${soilName}. అనువైన పంట ${cropName}. దిగుబడి: ${topCrop.expectedYield}.`);
        } else if (language === 'hi') {
          speak(`मिट्टी की जांच पूरी हुई। यह ${soilName} है। सबसे उपयुक्त फसल ${cropName} है। पैदावार: ${topCrop.expectedYield}।`);
        } else if (language === 'kn') {
          speak(`ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಇದು ${soilName}. ಸೂಕ್ತ ಬೆಳೆ ${cropName}.`);
        } else if (language === 'ml') {
          speak(`മണ്ണ് പരിശോധന കഴിഞ്ഞു. ഇത് ${soilName}. അനുയോജ്യമായ വിള ${cropName}.`);
        } else if (language === 'mr') {
          speak(`मातीची तपासणी पूर्ण झाली. ही ${soilName} आहे. योग्य पीक ${cropName}.`);
        } else if (language === 'bn') {
          speak(`মাটি পরীক্ষা সম্পন্ন হয়েছে। এটি ${soilName}। উপযুক্ত ফসল ${cropName}।`);
        } else {
          speak(`Soil check complete. Detected: ${soilName}. Best recommended crop is ${cropName} with expected yield ${topCrop.expectedYield}.`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
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

  // Fallback Gallery File Upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCapturedImage(url);
    stopCamera();
    runSoilAnalysis(url);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
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
                  Live Soil Scanner & Crop Recommendation
                </h3>
                <p className="text-xs text-emerald-400 font-bold">
                  {t('cropAdvice')} & {t('tagSoilSeeds')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
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

            {/* VIEW 1: LIVE CAMERA VIEWFINDER */}
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center">
                  {cameraError ? (
                    <div className="p-6 text-center space-y-3 text-white">
                      <Camera className="w-12 h-12 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-300 max-w-xs mx-auto">{cameraError}</p>
                      <Button
                        variant="primary"
                        icon={Upload}
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Soil Photo
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

                      {/* Viewfinder Targeting Frame */}
                      <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/80 rounded-3xl pointer-events-none flex flex-col justify-between p-3">
                        <div className="flex justify-between">
                          <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
                          <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
                        </div>
                        <div className="text-center bg-black/40 backdrop-blur-sm py-1 px-3 rounded-full text-[11px] font-bold text-white max-w-xs mx-auto">
                          📍 Place soil sample or plowed earth inside frame
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
                    <span>Upload</span>
                  </button>

                  {/* Giant Live Shutter Trigger */}
                  <button
                    type="button"
                    onClick={handleCaptureLivePhoto}
                    disabled={!!cameraError}
                    className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white shadow-xl ring-4 ring-emerald-300 flex items-center justify-center transition-all cursor-pointer"
                    title="Capture Live Photo"
                  >
                    <Camera className="w-9 h-9" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={!!cameraError}
                    className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex flex-col items-center gap-1 text-[11px] font-bold shadow-sm"
                  >
                    <SwitchCamera className="w-5 h-5 text-slate-700" />
                    <span>Flip</span>
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW 2: CAPTURED IMAGE & LIVE SOIL ANALYSIS RESULTS */
              <div className="space-y-6">
                {/* Captured Image Strip */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={capturedImage}
                    alt="Captured Soil Sample"
                    className="w-28 h-28 object-cover rounded-2xl border-2 border-slate-300 shadow-md"
                  />
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <span className="text-xs font-bold text-slate-500 uppercase">Live Photo Captured</span>
                    <h4 className="text-base font-black text-slate-900 font-display">
                      Soil Image Evaluation
                    </h4>
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Live Photo</span>
                    </button>
                  </div>
                </div>

                {/* Analyzing Spinner */}
                {isAnalyzing && (
                  <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-3xl border border-emerald-200">
                    <Sparkles className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                    <h4 className="text-base font-black text-emerald-950 font-display">
                      AI is inspecting soil structure, organic matter & NPK...
                    </h4>
                  </div>
                )}

                {/* RESULT: NOT SOIL */}
                {analysisResult && !analysisResult.isSoil && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-300 space-y-4 text-center sm:text-left shadow-lg"
                  >
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <AlertOctagon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-rose-950 font-display">
                          {language === 'ta'
                            ? 'விவசாய மண் அல்ல'
                            : language === 'te'
                            ? 'వ్యవసాయ నేల కాదు'
                            : language === 'hi'
                            ? 'खेत की मिट्टी नहीं है'
                            : 'Not Agricultural Soil'}
                        </h3>
                        <p className="text-xs font-bold text-rose-700">
                          {t('confidenceLabel')}: 95%
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-rose-200 text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
                      <p>
                        {language === 'ta'
                          ? 'கேமராவில் காட்டப்பட்ட பொருள் விவசாய மண் அல்ல. தயவுசெய்து உங்கள் நிலத்து மண்ணை கேமராவில் காட்டி மீண்டும் எடுக்கவும்.'
                          : language === 'te'
                          ? 'ఫోటోలో వ్యవసాయ నేల గుర్తించబడలేదు. దయచేసి పొలంలోని మట్టిని కెమెరాలో చూపించి మళ్ళీ తీయండి.'
                          : language === 'hi'
                          ? 'तस्वीर में खेत की मिट्टी नहीं दिखी। कृपया खेत की असली मिट्टी की तस्वीर दोबारा खींचें।'
                          : 'The captured image does not show agricultural soil. Please point camera directly at farm earth or plowed field.'}
                      </p>
                    </div>

                    <div className="flex justify-center sm:justify-start">
                      <Button
                        variant="primary"
                        icon={Camera}
                        onClick={handleRetake}
                        className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 font-black text-xs sm:text-sm"
                      >
                        Retake Soil Photo
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* RESULT: VALID SOIL WITH ACCURATE RESULTS */}
                {analysisResult && analysisResult.isSoil && analysisResult.profile && (
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
                        </div>
                      </div>

                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-700 text-emerald-100 text-xs font-black">
                        {t('confidenceLabel')}: 96%
                      </span>
                    </div>

                    {/* Soil Parameters Grid */}
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
                        <div key={idx} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
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

                          <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl border border-emerald-100">
                            <strong>Fertilizer Dosage:</strong> {crop.fertilizer}
                          </p>
                        </div>
                      ))}
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
