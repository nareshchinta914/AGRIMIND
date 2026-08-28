import React, { useState } from 'react';
import { Bot, Mic, Send, Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import { aiService } from '../../services/aiService';
import VoiceAssistantModal from '../../components/voice/VoiceAssistantModal';
import Button from '../../components/common/Button';

const FarmerAssistantPage = () => {
  const { language, t } = useLanguage();
  const { openAssistant, speak } = useVoice();
  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      sender: 'ai',
      text: 'வணக்கம்! நான் உங்கள் கிசான் AI உதவியாளர். உங்கள் பயிர், உரம், தண்ணீர் அல்லது சந்தை விலை குறித்து என்னிடம் கேட்கலாம்.',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await aiService.askKisanAI(userMsg.text, language);
      const aiReply = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
      speak(response.reply);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            🎙️ Kisan AI Voice & Chat Saathi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Ask AGRIMIND AI Assistant
          </h2>
          <p className="text-xs text-slate-300">
            Ask farm disease queries, fertilizer recipes, or weather guidance by voice or text in your regional language.
          </p>
        </div>

        <Button
          variant="amber"
          size="md"
          icon={Mic}
          onClick={openAssistant}
          className="shadow-lg shadow-yellow-500/30"
        >
          Open Voice Mode
        </Button>
      </div>

      {/* Interactive Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/10 text-[10px] opacity-75">
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => speak(m.text)}
                      className="hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Listen Aloud
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-3 rounded-2xl text-xs text-slate-500 animate-pulse">
                🌱 Kisan AI is analyzing agricultural records...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={openAssistant}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer transition-colors"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type your farm question here in Tamil, Hindi, Telugu, or English..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white cursor-pointer transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerAssistantPage;
