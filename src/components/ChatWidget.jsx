import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Maximize2, Minimize2, AlertCircle } from 'lucide-react';

const BACKEND_URL = "https://chat-6t0g.onrender.com/ask/stream";
const DEFAULT_DB_NAME = "AboutMe_chunks";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! 👋 I'm JP's AI assistant. Ask me anything about his skills or experience."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const messagesEndRef = useRef(null);

  // First appearance at 5s, subsequent appearances every 10s
  useEffect(() => {
    let hideTimeout;
    let loopInterval;

    // Helper to display the badge for 3 seconds before hiding
    const triggerBadgeVisibility = () => {
      setShowBadge(true);
      hideTimeout = setTimeout(() => {
        setShowBadge(false);
      }, 5000);
    };

    // 1. Initial 5-second delay for the FIRST appearance
    const initialTimeout = setTimeout(() => {
      triggerBadgeVisibility();

      // 2. Start repeating interval every 13s (10s hidden + 3s visible)
      loopInterval = setInterval(() => {
        triggerBadgeVisibility();
      }, 23000);
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(hideTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          db_name: DEFAULT_DB_NAME,
          history: conversationHistory,
        }),
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      setIsTyping(false);

      setMessages((prev) => [...prev, { sender: 'ai', text: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponseText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          let chunkText = '';
          if (trimmed.startsWith('data:')) {
            const dataContent = trimmed.replace(/^data:\s*/, '');
            if (dataContent === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataContent);
              chunkText = parsed.content || parsed.text || parsed.answer || parsed.delta || dataContent;
            } catch (_) {
              chunkText = dataContent;
            }
          } else {
            chunkText = trimmed;
          }

          fullResponseText += chunkText;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = fullResponseText;
            return updated;
          });
        }
      }

      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: fullResponseText },
      ]);
    } catch (err) {
      setIsTyping(false);
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I could not connect to the backend server.' },
      ]);
    }
  };

  return (
    <div className="fixed z-50 bottom-4 right-4">
      {/* Facebook Chat Head — Avatar circle with online dot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2"
        >
          {/* Desktop-only pointing banner (1st at 5s, subsequent every 10s) */}
          {showBadge && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg border border-slate-700/50 transition-all duration-500 animate-in fade-in slide-in-from-right-4">
              <span>Message JP's AI</span>
              
              {/* Rotated vertical bounce converts to horizontal left-to-right bounce */}
              <span className="inline-block animate-bounce -rotate-90 text-base leading-none">
                👇
              </span>
            </div>
          )}

          {/* Avatar Container */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-white shadow-xl overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <img
                src="/images/profile.jpg"
                alt="Chat"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
        </button>
      )}

      {/* Messenger-style Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMaximized
              ? 'w-[92vw] sm:w-[480px] h-[640px]'
              : 'w-[92vw] sm:w-[360px] h-[520px]'
          }`}
        >
          {/* Header — White, clean, FB-style */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600">
                  <Bot size={16} />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">JP's AI Assistant</h3>
                <p className="text-[11px] text-emerald-600 font-medium">Active now</p>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Service Notice Banner */}
          <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-100 text-amber-700 text-[11px] flex items-center gap-1.5 shrink-0">
            <AlertCircle size={12} className="shrink-0" />
            <span>Running on free web services. Responses may take longer to load.</span>
          </div>

          {/* Messages — FB Messenger bubble style */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 shrink-0 mr-1.5 mt-1">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2 text-[13px] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0084FF] text-white rounded-2xl rounded-br-sm'
                      : 'bg-[#F0F0F0] text-slate-900 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col gap-1">
                <div className="flex items-end">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 shrink-0 mr-1.5">
                    <Bot size={14} />
                  </div>
                  <div className="bg-[#F0F0F0] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 ml-8">
                  Waking up server (free tier)... please wait a moment.
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input — Rounded, FB-style */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-2 bg-white border-t border-slate-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Aa"
              className="flex-1 px-4 py-2.5 text-[13px] bg-slate-100 border-0 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`p-2.5 rounded-full transition-colors ${
                input.trim()
                  ? 'text-[#0084FF] hover:bg-slate-100'
                  : 'text-slate-300 cursor-default'
              }`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}