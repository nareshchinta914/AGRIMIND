import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Mic,
  Camera,
  Upload,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { aiService } from '../services/aiService';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

const AiAssistantPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: language === 'hi'
        ? 'नमस्ते किसान भाई! मैं एग्रीमाइंड का "किसान साथी AI" हूँ। अपनी फसल में कोई बीमारी, खाद की मात्रा, या मंडी भाव के बारे में पूछें। आप फसल की पत्ती की फोटो भी भेज सकते हैं!'
        : 'Namaste Farmer Friend! I am your Kisan AI Saathi. Ask me anything about crop diseases, fertilizer dosage, irrigation, or mandi rates. You can also upload a leaf photo for instant disease diagnosis!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [imageAnalysisModal, setImageAnalysisModal] = useState(null);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: '🌿 Yellow spots on wheat leaves', query: 'Yellow spots on wheat leaves, what is the remedy?' },
    { label: '🌱 Balanced fertilizer dosage for 5 acres', query: 'What is the optimal DAP and Urea dosage for Wheat?' },
    { label: '💧 Water requirement for Cotton in black soil', query: 'How many irrigations are needed for cotton in black soil?' },
    { label: '💰 Govt subsidy for Drip Irrigation', query: 'What are the government subsidy schemes for drip irrigation?' }
  ];

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await aiService.askKisanAI(text, language);
      const aiReply = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.suggestedActions,
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      toast.error('Failed to get AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceSimulate = () => {
    if (isListening) return;
    setIsListening(true);
    toast.info('Listening for your voice in Hindi/English...');
    setTimeout(() => {
      setIsListening(false);
      setInputText('How to control pink bollworm in cotton?');
    }, 2500);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageAnalyzing(true);
    try {
      const result = await aiService.analyzeCropImage(file);
      setImageAnalysisModal(result);
      toast.success('Leaf disease scan completed!');
    } catch (err) {
      toast.error('Failed to analyze image');
    } finally {
      setImageAnalyzing(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full min-h-[85vh] flex flex-col">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-agri-900 via-slate-900 to-agri-950 text-white p-6 rounded-3xl shadow-xl border border-agri-800/40 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sunAmber-400 to-agri-600 flex items-center justify-center text-slate-950 shadow-lg flex-shrink-0">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-display text-white">Kisan AI Saathi</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online 24/7
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Indian Agricultural Intelligence • Multi-lingual • Voice & Leaf Scan enabled
            </p>
          </div>
        </div>

        {/* Action button for Image Scan */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="amber"
            size="sm"
            icon={Camera}
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold"
          >
            Scan Crop Leaf
          </Button>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p.query)}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-agri-500 hover:bg-agri-50 transition-all flex-shrink-0 cursor-pointer shadow-sm"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[55vh]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-agri-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? 'You' : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
                <span
                  className={`block text-[10px] mt-2 font-medium ${
                    msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-agri-600 text-white flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-agri-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-agri-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-agri-500 animate-bounce [animation-delay:0.4s]"></span>
                <span>Kisan AI is analyzing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/80 flex items-center gap-2">
          {/* Voice button */}
          <button
            type="button"
            onClick={handleVoiceSimulate}
            className={`p-3 rounded-2xl transition-all shadow-sm ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Speak in Hindi / English"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : 'Type your farming query in English or हिन्दी...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-agri-600 focus:ring-2 focus:ring-agri-100"
          />

          {/* Send button */}
          <Button
            variant="primary"
            size="md"
            icon={Send}
            onClick={() => handleSendMessage()}
            className="px-4 shadow-lg shadow-agri-600/30"
          >
            Send
          </Button>
        </div>
      </div>

      {/* Disease Diagnosis Modal */}
      {imageAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Disease Detected
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-display mt-2">
                  {imageAnalysisModal.diseaseDetected}
                </h3>
                <p className="text-xs font-semibold text-agri-700">{imageAnalysisModal.hindiDisease}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">AI Confidence</span>
                <span className="text-lg font-black text-emerald-600 font-display">
                  {imageAnalysisModal.confidence}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Recommended Chemical Spray:</p>
                <ul className="list-disc list-inside space-y-1">
                  {imageAnalysisModal.recommendedCure?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <p className="font-bold mb-1">Bio-Organic Alternative:</p>
                <p>{imageAnalysisModal.preventiveOrganicSolution}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={() => setImageAnalysisModal(null)}>
                Got It, Thank You
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantPage;
