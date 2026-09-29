

import React, { useState, useRef, useEffect } from 'react';
import { ASSETS } from '../constants';
import { sendMessageToAI } from '../services/aiService';
import { Message } from '../types';
import { useHealth } from '../context/HealthContext';

const Chat: React.FC = () => {
  const { userName } = useHealth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${userName}, I'm Neuro AI. I've reviewed your latest vitals. Your stability is looking great this morning. How can I help you today?`,
      timestamp: '10:23 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      // Context for AI
      const userContext = `Patient Name: ${userName}. Stability Score: 94%.`;

      const response = await sendMessageToAI(input, history, userContext);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-background-dark overflow-hidden">
      {/* Sidebar - Chat History / Topics */}
      <aside className="hidden lg:flex flex-col w-80 bg-surface-dark/30 border-r border-white/5 p-6 shrink-0">
        <h3 className="font-display font-bold text-xl mb-6">Chat History</h3>
        <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
          {[
            { title: 'Medication Side Effects', date: 'Yesterday' },
            { title: 'Stability Trends', date: 'Oct 22' },
            { title: 'MRI Result Explanation', date: 'Oct 20' },
            { title: 'Cognitive Test Results', date: 'Oct 15' }
          ].map((chat, i) => (
            <button key={i} className="text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
              <p className="font-bold text-sm text-slate-200 truncate">{chat.title}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{chat.date}</p>
            </button>
          ))}
        </div>
        <div className="mt-auto p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Clinical Context</span>
          </div>
          <p className="text-xs text-slate-400 italic">Neuro AI is using your patient profile #4829 for personalized context.</p>
        </div>
      </aside>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col relative">
        <header className="flex items-center justify-between p-6 border-b border-white/5 bg-background-dark/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-2xl bg-cover bg-center border border-white/10"
                style={{ backgroundImage: `url("${ASSETS.AI_AVATAR}")` }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background-dark"></div>
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Neuro Assistant</h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                System Ready • HIPAA Encrypted
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold">
              <span className="material-symbols-outlined text-lg">print</span> Print Transcript
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-900/20 text-red-400 border border-red-500/20 text-sm font-bold">
              <span className="material-symbols-outlined text-[20px]">emergency_share</span> Emergency
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 no-scrollbar max-w-4xl mx-auto w-full">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-6 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-10 h-10 rounded-xl bg-cover bg-center shrink-0 border border-white/10 ${msg.role === 'user' ? 'hidden' : ''}`}
                style={{ backgroundImage: `url("${ASSETS.AI_AVATAR}")` }}
              />
              <div className={`flex flex-col gap-2 max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-6 rounded-[2rem] ${msg.role === 'user'
                  ? 'rounded-tr-none bg-primary text-white shadow-2xl shadow-primary/20'
                  : 'rounded-tl-none bg-surface-dark text-white border border-white/5 shadow-xl'
                  }`}>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-6">
              <div
                className="w-10 h-10 rounded-xl bg-cover bg-center shrink-0 opacity-50 animate-pulse"
                style={{ backgroundImage: `url("${ASSETS.AI_AVATAR}")` }}
              />
              <div className="p-6 rounded-[2rem] rounded-tl-none bg-surface-dark flex gap-1.5">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-24" />
        </div>

        {/* Input Dock */}
        <div className="p-8 bg-gradient-to-t from-background-dark via-background-dark to-transparent sticky bottom-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar py-1">
              {['Explain Keppra dose', 'Analyze today\'s stability', 'Symptoms of migraine', 'Mood assessment'].map(chip => (
                <button
                  key={chip}
                  onClick={() => { setInput(chip); }}
                  className="shrink-0 px-6 py-2 rounded-full bg-surface-dark text-slate-300 text-xs font-bold border border-white/5 whitespace-nowrap hover:bg-white/10 hover:border-primary/50 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-3 bg-surface-dark border border-white/10 rounded-[2.5rem] p-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-2xl">
              <button className="w-14 h-14 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">attach_file</span>
              </button>
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Ask anything about your neurological health..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-lg py-4 px-2 resize-none max-h-48"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${input.trim()
                  ? 'bg-primary text-white scale-100 shadow-lg shadow-primary/30'
                  : 'bg-slate-800 text-slate-500 scale-90'
                  }`}
              >
                <span className="material-symbols-outlined font-bold">arrow_upward</span>
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-4 font-bold uppercase tracking-[0.2em]">End-to-end encrypted medical assistant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
