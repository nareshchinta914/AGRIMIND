import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  Bot,
  Building2,
  Users,
  Phone,
  Image as ImageIcon,
  CheckCheck,
  Sparkles,
  Volume2,
  ThumbsUp,
  MessageCircle,
  Paperclip
} from 'lucide-react';
import { INITIAL_MERCHANT_CHATS, INITIAL_COMMUNITY_POSTS } from '../../services/chatService';
import { aiService } from '../../services/aiService';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../common/Button';

const ChatDrawerModal = ({ isOpen, onClose, defaultTab = 'ai', targetMerchant = null }) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'ai', 'merchants', 'community'
  const [merchantChats, setMerchantChats] = useState(INITIAL_MERCHANT_CHATS);
  const [selectedChat, setSelectedChat] = useState(targetMerchant || INITIAL_MERCHANT_CHATS[0]);
  const [communityPosts, setCommunityPosts] = useState(INITIAL_COMMUNITY_POSTS);

  // AI Chat State
  const [aiMessages, setAiMessages] = useState([
    {
      id: 'ai_intro',
      sender: 'ai',
      text: 'வணக்கம்! I am Kisan AI Saathi. Ask me anything about crop diseases, fertilizers, weather, or mandi prices in your language.',
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newPostText, setNewPostText] = useState('');

  const messagesEndRef = useRef(null);
  const { speak } = useVoice();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (targetMerchant) {
      setSelectedChat(targetMerchant);
      setActiveTab('merchants');
    }
  }, [targetMerchant]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, selectedChat?.messages, isTyping]);

  const handleSendAiMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await aiService.askKisanAI(userText, language);
      const aiReplyMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiMessages((prev) => [...prev, aiReplyMsg]);
      speak(response.reply);
    } catch (err) {
      const fallback = 'I received your query. Please check our crop tools for recommendations.';
      setAiMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: fallback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMerchantMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !selectedChat) return;

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: 'farmer',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = merchantChats.map((c) => {
      if (c.id === selectedChat.id) {
        return {
          ...c,
          lastMessage: newMsg.text,
          lastTime: newMsg.time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setMerchantChats(updated);
    setSelectedChat(updated.find((c) => c.id === selectedChat.id));
    setInputMessage('');

    // Simulate Merchant quick response
    setTimeout(() => {
      const replyMsg = {
        id: 'reply_' + Date.now(),
        sender: 'merchant',
        text: `Got your message. Our procurement manager will contact you at your registered phone number.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const afterReply = updated.map((c) => {
        if (c.id === selectedChat.id) {
          return {
            ...c,
            lastMessage: replyMsg.text,
            lastTime: replyMsg.time,
            messages: [...c.messages, replyMsg]
          };
        }
        return c;
      });
      setMerchantChats(afterReply);
      setSelectedChat(afterReply.find((c) => c.id === selectedChat.id));
    }, 1500);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: 'comm_' + Date.now(),
      farmerName: 'Current Farmer',
      state: 'Tamil Nadu',
      crop: 'Paddy',
      text: newPostText.trim(),
      likes: 1,
      replies: 0,
      time: 'Just now'
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setNewPostText('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="relative w-full max-w-lg h-full sm:h-[95vh] sm:my-auto sm:mr-4 bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        >
          {/* Top Header */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black font-display text-white">
                  AGRIMIND Kisan Chat
                </h3>
                <p className="text-xs text-emerald-400 font-bold">
                  ● Live Support & Merchant Deals
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Navigation Tabs */}
          <div className="grid grid-cols-3 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-black">
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'ai'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Kisan AI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('merchants')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all relative ${
                activeTab === 'merchants'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Merchants ({merchantChats.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('community')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'community'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Community</span>
            </button>
          </div>

          {/* TAB 1: KISAN AI CHAT */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm mt-1">
                        🌾
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none space-y-2'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      {msg.sender === 'ai' && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>{msg.time}</span>
                          <button
                            type="button"
                            onClick={() => speak(msg.text)}
                            className="p-1 text-slate-500 hover:text-emerald-700"
                            title="Read Aloud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                    <Sparkles className="w-4 h-4 text-sunAmber-500 animate-spin" />
                    <span>Kisan AI is typing advice...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  'நெல் உரம் அளவு என்ன?',
                  'Tomato market price today?',
                  'Best crop for alluvial soil'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputMessage(chip);
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-bold text-slate-600 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendAiMessage}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Kisan AI question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: MERCHANTS & MILLERS LIVE CHAT */}
          {activeTab === 'merchants' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50">
              {/* Merchant Contact Banner */}
              {selectedChat && (
                <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-slate-100 rounded-xl">{selectedChat.avatar}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-display line-clamp-1">
                        {selectedChat.name}
                      </h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">{selectedChat.location}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${selectedChat.phone}`}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 text-xs font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedChat?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'farmer' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                        msg.sender === 'farmer'
                          ? 'bg-emerald-700 text-white rounded-tr-none'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className="text-[10px] text-right mt-1 opacity-70 flex items-center justify-end gap-1">
                        <span>{msg.time}</span>
                        {msg.sender === 'farmer' && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Deal Action Bar */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  'I have 50 Quintals ready',
                  'Can you arrange transport?',
                  'Share mandi weighing slip'
                ].map((deal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputMessage(deal)}
                    className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-[11px] font-bold text-slate-700 rounded-full border border-slate-200 whitespace-nowrap"
                  >
                    {deal}
                  </button>
                ))}
              </div>

              {/* Send Form */}
              <form
                onSubmit={handleSendMerchantMessage}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Message ${selectedChat?.name?.split(' ')[0] || 'Merchant'}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: KISAN COMMUNITY */}
          {activeTab === 'community' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50">
              {/* Community Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {/* Create Post Box */}
                <form onSubmit={handleCreatePost} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                  <textarea
                    rows={2}
                    placeholder="Share farm tips or ask fellow farmers..."
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm">
                      Post to Community
                    </Button>
                  </div>
                </form>

                {communityPosts.map((post) => (
                  <div key={post.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{post.farmerName}</span>
                        <span className="text-slate-400 ml-1">({post.state})</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {post.crop}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {post.text}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span className="text-[11px] text-slate-400">{post.time}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="flex items-center gap-1 hover:text-emerald-700 font-semibold"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.likes}</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 hover:text-emerald-700 font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.replies} Replies</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatDrawerModal;
