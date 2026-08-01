import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Bot, X, Send, Maximize2, Minimize2, AlertCircle,
  Mic, MicOff, Volume2, VolumeX, Settings2
} from 'lucide-react';
import { getThemeTokens } from '../theme';

const BACKEND_URL = "https://chat-6t0g.onrender.com/ask/stream";
const DEFAULT_DB_NAME = "AboutMe_chunks";

export default function ChatWidget() {
  const theme = useSelector((state) => state.theme.value);
  const tokens = getThemeTokens(theme);
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm JP's AI assistant. Ask me anything about his skills or experience."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceURI, setVoiceURI] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const widgetRef = useRef(null); // <-- NEW: ref for detecting outside clicks

  const speechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const synthSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Auto-open the chat window on page access
  useEffect(() => {
    const openTimeout = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(openTimeout);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ------------------------------------------------------------------ */
  /*  NEW: close when clicking outside the widget                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Set up speech recognition once
  useEffect(() => {
    if (!speechSupported) return;

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (final) finalTranscriptRef.current += final;
      setInput((finalTranscriptRef.current + interim).trim());
    };

    recognition.onend = () => {
      setIsListening(false);
      finalTranscriptRef.current = '';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop any voice activity when the widget is closed
  useEffect(() => {
    if (!isOpen) {
      if (synthSupported) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load available system voices for the speaker
  useEffect(() => {
    if (!synthSupported) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length) {
        setVoices(available);
        setVoiceURI((prev) => {
          if (prev && available.some((v) => v.voiceURI === prev)) return prev;
          const preferred = available.find((v) => v.lang?.startsWith('en')) || available[0];
          return preferred.voiceURI;
        });
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synthSupported]);

  const speak = (text, { force = false } = {}) => {
    if ((!force && !voiceEnabled) || !synthSupported || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const chosenVoice = voices.find((v) => v.voiceURI === voiceURI);
    if (chosenVoice) utterance.voice = chosenVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (!synthSupported) return next;

      if (!next) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'ai' && m.text);
        if (lastAiMessage) speak(lastAiMessage.text, { force: true });
      }
      return next;
    });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (synthSupported) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      finalTranscriptRef.current = '';
      setInput('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Could not start recognition:', err);
      }
    }
  };

  const submitMessage = async (rawText) => {
    const userMessage = (rawText ?? '').trim();
    if (!userMessage) return;

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

      speak(fullResponseText);
    } catch (err) {
      setIsTyping(false);
      console.error('Chat error:', err);
      const fallback = 'Sorry, I could not connect to the backend server.';
      setMessages((prev) => [...prev, { sender: 'ai', text: fallback }]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    submitMessage(input);
  };

  return (
    /* ---------------------------------------------------------------- */
    /*  Wrapper now has a fixed size so the chat window can be absolute  */
    /*  and overflow without blocking clicks when closed.                 */
    /* ---------------------------------------------------------------- */
    <div ref={widgetRef} className="fixed z-50 bottom-4 right-4 w-14 h-14">
      {/* Chat Head — fades/scales out when open, in when closed */}
      <button
        onClick={() => setIsOpen(true)}
        className={`absolute inset-0 block transition-all duration-300 ease-out ${isOpen
          ? 'opacity-0 scale-75 pointer-events-none'
          : 'opacity-100 scale-100'
          }`}
      >
        <div className="relative">
          <div className={`w-15 h-15 rounded-full border-2  overflow-hidden transition-transform hover:scale-105 active:scale-95 ${isDark ? 'border-slate-700 bg-slate-900 shadow-l' : 'border-gray-200 bg-white shadow-2xl shadow-pink-300 '}`}>
            <div className="flex items-center justify-center w-full h-full object-cover">
              <Bot size={33} />
            </div>
          </div>
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
      </button>

      {/* Chat Window — slides up and scales in when open, reverses when closed */}
      <div
        className={`absolute bottom-0 right-0 rounded-2xl border shadow-2xl flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ease-out ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} ${isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          } ${isMaximized
            ? 'w-[92vw] sm:w-[480px] h-[640px]'
            : 'w-[92vw] sm:w-[360px] h-[520px]'
          }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-3 py-2.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'} ${isSpeaking ? 'ring-2 ring-[#0084FF] animate-pulse' : ''}`}>
                <Bot size={16} />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>JP's AI Assistant</h3>
              <p className="text-[11px] text-emerald-600 font-medium">Active now</p>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleVoice}
              disabled={!synthSupported}
              title={
                !synthSupported
                  ? 'Voice replies not supported in this browser'
                  : voiceEnabled
                    ? 'Voice replies on'
                    : 'Voice replies off'
              }
              className={`p-2 rounded-full transition-colors ${!synthSupported
                ? 'text-slate-200 cursor-not-allowed'
                : voiceEnabled
                  ? 'text-[#0084FF] hover:bg-blue-50'
                  : isDark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={() => setShowVoiceSettings((v) => !v)}
              disabled={!synthSupported}
              title="Voice settings"
              className={`p-2 rounded-full transition-colors ${!synthSupported
                ? 'text-slate-200 cursor-not-allowed'
                : showVoiceSettings
                  ? 'text-[#0084FF] bg-blue-50'
                  : isDark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
            >
              <Settings2 size={16} />
            </button>
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

        {/* Voice Settings Popover */}
        {showVoiceSettings && (
          <div className={`absolute top-14 right-2 z-20 w-64 rounded-xl border shadow-xl p-3 space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div>
              <label className={`mb-1 block text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Voice
              </label>
              <select
                value={voiceURI}
                onChange={(e) => setVoiceURI(e.target.value)}
                className={`w-full rounded-lg border px-2 py-1.5 text-[12px] focus:outline-none ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-800'}`}
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                <span>Speed</span>
                <span>{rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-[#0084FF]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                <span>Tone (pitch)</span>
                <span>{pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-[#0084FF]"
              />
            </div>

            <button
              type="button"
              onClick={() => speak("Hi, this is how I'll sound.", { force: true })}
              className={`w-full rounded-lg py-1.5 text-[12px] font-semibold transition-colors ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Preview voice
            </button>
          </div>
        )}

        {/* Service Notice Banner */}
        <div className={`flex items-center gap-1.5 shrink-0 border-b px-3 py-1.5 text-[11px] ${isDark ? 'border-amber-900/50 bg-amber-950/40 text-amber-300' : 'border-amber-100 bg-amber-50 text-amber-700'}`}>
          <AlertCircle size={12} className="shrink-0" />
          <span>Running on free web services. Responses may take longer to load.</span>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className={`mr-1.5 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                  <Bot size={14} />
                </div>
              )}
              <div
                className={`max-w-[78%] px-3.5 py-2 text-[13px] leading-relaxed ${msg.sender === 'user'
                  ? 'bg-[#0084FF] text-white rounded-2xl rounded-br-sm'
                  : isDark
                    ? 'bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm'
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
                <div className={`mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                  <Bot size={14} />
                </div>
                <div className={`flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-[#F0F0F0]'}`}>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>
              <span className={`ml-8 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Waking up server (free tier)... please wait a moment.
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className={`flex items-center gap-1 border-t p-2 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
          <button
            type="button"
            onClick={toggleListening}
            disabled={!speechSupported}
            title={
              !speechSupported
                ? 'Voice input not supported in this browser'
                : isListening
                  ? 'Stop listening'
                  : 'Speak your message'
            }
            className={`p-2.5 rounded-full transition-colors shrink-0 ${!speechSupported
              ? 'text-slate-200 cursor-not-allowed'
              : isListening
                ? 'text-red-500 bg-red-50 animate-pulse'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Aa'}
            className={`flex-1 rounded-full border-0 px-4 py-2.5 text-[13px] focus:outline-none focus:ring-0 ${isDark ? 'bg-slate-800 text-slate-100 placeholder:text-slate-500' : 'bg-slate-100 text-slate-800 placeholder:text-slate-400'}`}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2.5 rounded-full transition-colors shrink-0 ${input.trim()
              ? 'text-[#0084FF] hover:bg-slate-100'
              : 'text-slate-300 cursor-default'
              }`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}