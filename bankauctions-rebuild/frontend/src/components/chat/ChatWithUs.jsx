import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  X,
  Minus,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Scale,
  Crown,
  HelpCircle
} from 'lucide-react';

const QUICK_PROMPTS = [
  'How does AI Rank score properties?',
  'What is in the ₹499 Pro pack?',
  'How does Premium curation work?',
  'Talk to an empanelled DRT lawyer',
  'Physical vs Symbolic possession',
  'What is Concierge service?'
];

export default function ChatWithUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! I am the BankAuctions.ai assistant. Ask me how AI rank works, what Pro and Premium include, how auctions run, or how to speak to an empanelled lawyer.',
      time: 'Just now',
      actionLink: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const generateAnswer = (query) => {
    const q = query.toLowerCase();

    if (q.includes('rank') || q.includes('score')) {
      return {
        text: 'AI Rank scores each listing out of 100 on 4 core pillars:\n\n• Discount below market (40% weight)\n• Possession status — physical vs symbolic (25% weight)\n• Location, road width & arterial access (20% weight)\n• Document completeness & title clarity (15% weight)\n\nProperties are then ranked within their specific asset category and city.',
        actionLink: { label: 'Explore Data & Intelligence', url: '/data' }
      };
    }

    if (q.includes('pro') || q.includes('499') || q.includes('unlock') || q.includes('pack')) {
      return {
        text: 'Pro is ₹499 for 5 property unlocks. It has NO expiry — your credits stay active until all 5 properties are unlocked. Every unlocked property is permanently saved to your My Archive dossier with full AI rank breakdown, field inspection photographs, and valuation summaries.',
        actionLink: { label: 'View Pricing Plans', url: '/pricing' }
      };
    }

    if (q.includes('premium') || q.includes('curated') || q.includes('highway') || q.includes('corner')) {
      return {
        text: 'Premium is our curated subscription (₹1,499 for 1 month, ₹2,699 for 2 months, ₹3,499 for 3 months) covering high-commercial-value listings in your chosen city: highway frontages, corner plots, and prime commercial warehouses.',
        actionLink: { label: 'Browse Premium Listings', url: '/premium' }
      };
    }

    if (q.includes('lawyer') || q.includes('legal') || q.includes('drt') || q.includes('advocate') || q.includes('bench')) {
      return {
        text: 'You can book a 30 to 90 minute consultation with a senior High Court and DRT advocate enrolled with the State Bar Council. Calls happen over an encrypted portal bridge — neither party sees the other\'s phone number or email address.',
        actionLink: { label: 'Talk to a Lawyer', url: '/lawyers' }
      };
    }

    if (q.includes('possession') || q.includes('symbolic') || q.includes('physical') || q.includes('section 14') || q.includes('section 13')) {
      return {
        text: 'Under SARFAESI:\n\n• Symbolic Possession (Sec 13(4)): Bank has legal rights, but borrower or tenant may still occupy the premises.\n• Physical Possession (Sec 14): Chief Metropolitan Magistrate / District Magistrate order has been executed, keys are in bank possession, and the premises are physically vacant.',
        actionLink: { label: 'Read Possession Guide', url: '/learn' }
      };
    }

    if (q.includes('concierge') || q.includes('assist') || q.includes('end to end')) {
      return {
        text: 'Our Concierge service offers full-cycle buyer representation for serious auction investors: personalized property shortlisting, 30-year encumbrance search, engineer site inspection, and bid room strategy on auction day.',
        actionLink: { label: 'Open Concierge Desk', url: '/concierge' }
      };
    }

    if (q.includes('flat') || q.includes('house') || q.includes('plot') || q.includes('shop') || q.includes('office') || q.includes('warehouse') || q.includes('vehicle')) {
      return {
        text: 'We track 7 distinct asset classes across Chennai, Hyderabad, Bengaluru, Coimbatore, and Kerala. You can filter properties by category, reserve price, closing window, and AI rank in our search portal.',
        actionLink: { label: 'Browse All Categories', url: '/search' }
      };
    }

    return {
      text: 'Thanks for reaching out! In the live platform, our advisory desk responds within 5 minutes (Weekdays, 9am to 7pm IST). You can also submit an inquiry ticket or reach us directly at support@bankauctions.ai.',
      actionLink: { label: 'Help & Support', url: '/support' }
    };
  };

  const handleSendMessage = (textToSend = inputValue) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAnswer(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        time: 'Just now',
        actionLink: response.actionLink
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed right-4 sm:right-6 bottom-5 z-50 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_10px_30px_rgba(224,36,94,0.45)] hover:shadow-[0_14px_40px_rgba(224,36,94,0.6)] border border-rose-400/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            aria-label="Chat with us"
          >
            <div className="relative">
              <MessageCircle size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b101e] animate-pulse" />
            </div>
            <span>Chat with us</span>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div
            className={`w-[360px] sm:w-[400px] max-w-[calc(100vw-32px)] bg-[#0b101e] border border-white/10 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isMinimized ? 'h-14' : 'h-[520px] max-h-[calc(100vh-100px)]'
            }`}
          >
            {/* Header */}
            <div className="bg-[#0f172a] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
                    Ask BankAuctions
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live · 9am to 7pm IST
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Minimize"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content (Body + Form) - Hidden when minimized */}
            {!isMinimized && (
              <>
                {/* Scrollable Messages Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm custom-scrollbar bg-gradient-to-b from-[#0b101e] to-[#070b14]">
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot size={14} />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                            isUser
                              ? 'bg-rose-600 text-white rounded-tr-none shadow-md shadow-rose-600/20'
                              : 'bg-white/[0.05] border border-white/[0.08] text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-line">{msg.text}</div>

                          {msg.actionLink && (
                            <div className="mt-2.5 pt-2 border-t border-white/10">
                              <Link
                                to={msg.actionLink.url}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                              >
                                {msg.actionLink.label}
                                <ArrowRight size={12} />
                              </Link>
                            </div>
                          )}

                          <div
                            className={`text-[10px] mt-1 text-right ${
                              isUser ? 'text-rose-200/70' : 'text-slate-500'
                            }`}
                          >
                            {msg.time}
                          </div>
                        </div>

                        {isUser && (
                          <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                            <User size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <Bot size={14} />
                      </div>
                      <div className="flex items-center gap-1 bg-white/[0.05] px-3 py-2 rounded-xl border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Bar */}
                <div className="px-3 py-2 bg-slate-950/60 border-t border-white/[0.05] overflow-x-auto no-scrollbar flex items-center gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300 hover:text-white border border-white/[0.06] shrink-0 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-[#0a0f1d] border-t border-white/[0.08] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a question..."
                    className="flex-1 bg-slate-900/90 text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-rose-500/80 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white flex items-center justify-center shrink-0 transition-colors shadow-md shadow-rose-600/30"
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
