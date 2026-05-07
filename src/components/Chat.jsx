import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, GraduationCap, MessageSquare } from 'lucide-react';

const SENDER_CONFIG = {
  mentor: { icon: GraduationCap, gradient: 'from-primary-500 to-primary-700', bg: 'bg-primary-50', border: 'border-primary-100', label: 'Dr. Mehra' },
  mentee: { icon: User, gradient: 'from-accent-500 to-accent-700', bg: 'bg-accent-50', border: 'border-accent-100', label: 'Priya Patel' },
  ai: { icon: Bot, gradient: 'from-violet-500 to-purple-700', bg: 'bg-violet-50', border: 'border-violet-100', label: 'AI Assistant' },
};

function ChatBubble({ message, isOwn }) {
  const config = SENDER_CONFIG[message.sender];
  const Icon = config.icon;

  return (
    <div className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''} animate-[fadeSlide_0.3s_ease-out]`}>
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-surface-600">{message.name}</span>
          <span className="text-[10px] text-surface-400">{message.time}</span>
          {message.sender === 'ai' && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-100 text-violet-600">AI</span>
          )}
        </div>
        <div className={`px-3.5 py-2.5 rounded-2xl ${isOwn ? 'rounded-tr-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20' : `${config.bg} ${config.border} border`}`}>
          <p className={`text-[13px] leading-relaxed ${isOwn ? 'text-white' : 'text-surface-700'}`}>{message.text}</p>
        </div>
      </div>
    </div>
  );
}

export default function Chat({ role, messages, onSendMessage, onChatUpdate, aiResponses, student }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const senderLabel = role === 'mentor' ? 'Dr. Mehra' : student?.name || 'Mentee';

    const userMsg = {
      id: Date.now(),
      sender: role,
      name: senderLabel,
      text: input.trim(),
      time,
    };

    onSendMessage(userMsg);
    const lowerInput = input.toLowerCase();
    const currentInput = input.trim();
    setInput('');
    onChatUpdate(lowerInput);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      setIsTyping(true);
      try {
        const historyStr = messages.map(m => `${m.name}: ${m.text}`).join('\n');
        const prompt = `You are MentorAI, an intelligent academic mentoring assistant in a 3-way chat between a Mentor (Dr. Mehra) and a Mentee (${student?.name}).
        The mentee's current attendance is ${student?.attendance}%.
        Their marks are: ${JSON.stringify(student?.marks || {})}.
        
        Recent chat history:
        ${historyStr}
        ${senderLabel}: ${currentInput}
        
        Provide a helpful, encouraging, and brief response (maximum 2-3 sentences) addressing the latest message. Do not prefix your response with your name. Keep it highly relevant to their academic data if they ask for advice.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble analyzing this right now.";

        const aiMsg = { id: Date.now() + 1, sender: 'ai', name: 'AI Assistant', text: aiText, time };
        onSendMessage(aiMsg);
      } catch (err) {
        console.error("LLM Error:", err);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Fallback Check for AI trigger
      const triggered = aiResponses?.find((r) => lowerInput.includes(r.trigger));
      if (triggered) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const aiMsg = {
            id: Date.now() + 1,
            sender: 'ai',
            name: 'AI Assistant',
            text: triggered.response,
            time,
          };
          onSendMessage(aiMsg);
        }, 1500);
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl border border-surface-200/60 shadow-sm flex flex-col h-[480px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-surface-100">
        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-surface-800">Live Session Chat</h3>
          <p className="text-[10px] text-surface-400">Mentor • Mentee • AI Assistant</p>
        </div>
        <div className="flex -space-x-2">
          {Object.entries(SENDER_CONFIG).map(([key, cfg]) => {
            const I = cfg.icon;
            return (
              <div key={key} className={`w-7 h-7 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center ring-2 ring-white`}>
                <I className="w-3.5 h-3.5 text-white" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isOwn={msg.sender === role} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-surface-400">
            <Bot className="w-4 h-4 text-violet-500" />
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[11px] font-medium">AI is analyzing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-surface-100">
        <div className="flex items-center gap-2 bg-surface-50 rounded-xl border border-surface-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:border-primary-300 transition-all">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message as ${role === 'mentor' ? 'Mentor' : 'Mentee'}... (try "exams", "attendance")`}
            className="flex-1 bg-transparent text-xs text-surface-700 placeholder:text-surface-400 outline-none py-1.5"
          />
          <button
            id="send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/25 hover:shadow-lg disabled:opacity-40 disabled:shadow-none transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
