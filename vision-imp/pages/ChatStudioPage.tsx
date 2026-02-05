import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Image as ImageIcon, Sparkles, Info, Edit3, Rocket, Eraser, Bot, User as UserIcon } from 'lucide-react';
import Logo from '../components/icons/Logo';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const ChatStudioPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    const textToSend = input;
    const newUserMessage: Message = { id: Date.now(), text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "This is a simulated response from Vision AI. In a production environment, I would provide a detailed and creative answer based on your prompt. This frontend-only version showcases the application's UI and animations.",
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 pt-[72px] flex flex-col bg-default-bg-primary/50 dark:bg-space-bg-primary/50 overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-4xl mx-auto w-full min-h-full flex flex-col">
          {messages.length === 0 && !isTyping ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Logo className="h-20 w-20 mx-auto text-default-accent-gold" />
                  <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tighter">Vision Studio</h1>
                  <p className="text-lg text-default-text-secondary dark:text-space-text-secondary mt-4 max-w-lg mx-auto">
                    Sophisticated AI for high-fidelity brainstorming.
                  </p>
               </motion.div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-2xl px-4">
                  {["Design luxury branding", "Draft a cinematic script", "Analyze creative trends", "Refine project specs"].map((label, i) => (
                    <motion.button 
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        onClick={() => setInput(label)}
                        className="p-5 rounded-2xl bg-white/60 dark:bg-space-card/60 backdrop-blur-xl border border-default-border dark:border-space-border text-left font-bold shadow-sm hover:border-default-accent-gold transition-all"
                    >
                        {label}
                    </motion.button>
                  ))}
              </div>
            </div>
          ) : (
              <div className="w-full space-y-6 py-8">
                  {messages.map(msg => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${msg.sender === 'user' ? 'bg-default-accent-gold' : 'bg-white dark:bg-space-card'}`}>
                          {msg.sender === 'user' ? <UserIcon size={18} className="text-white" /> : <Bot size={18} className="text-default-accent-gold" />}
                        </div>
                        <div className={`max-w-[80%] p-4 md:p-6 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-default-accent-gold text-white' : 'bg-white dark:bg-space-card border border-default-border'}`}>
                            {msg.text || "..."}
                        </div>
                      </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-space-card border border-default-border">
                          <Bot size={18} className="text-default-accent-gold" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/50 dark:bg-space-card/50 flex gap-1">
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-default-accent-gold rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-default-accent-gold rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-default-accent-gold rounded-full" />
                        </div>
                    </div>
                  )}
              </div>
          )}
        </div>
        <div ref={messagesEndRef} className="h-4" />
      </main>

      <footer className="w-full bg-white/50 dark:bg-space-bg-secondary/50 backdrop-blur-3xl border-t border-default-border dark:border-space-border px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-grow relative flex items-center bg-white dark:bg-space-card rounded-2xl border-2 border-transparent focus-within:border-default-accent-gold transition-all shadow-xl overflow-hidden">
              <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Vision to strategize..."
                  rows={1}
                  className="w-full bg-transparent p-4 pr-14 resize-none outline-none font-medium"
                  style={{ minHeight: '56px' }}
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className={`absolute right-3 p-2 rounded-xl transition-all ${input.trim() && !isTyping ? 'bg-default-accent-gold text-white' : 'text-gray-400'}`}
              >
                  <Send size={20}/>
              </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatStudioPage;
