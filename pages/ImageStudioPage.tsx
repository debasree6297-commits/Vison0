import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Sparkles, Download, RefreshCw, Layers, AlertTriangle, Monitor, Smartphone, Square } from 'lucide-react';

interface Generation {
  id: number;
  prompt: string;
  status: 'loading' | 'done' | 'error';
  imageUrl?: string;
  error?: string;
  aspectRatio: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const ImageStudioPage = () => {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [input, setInput] = useState('');
    const [selectedRatio, setSelectedRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, [generations]);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
      }
    }, [input]);

    const getPlaceholderUrl = (ratio: '1:1' | '16:9' | '9:16') => {
      const sizes = {
        '1:1': '1024x1024',
        '16:9': '1280x720',
        '9:16': '720x1280',
      };
      const text = `Vision ${ratio}`;
      return `https://placehold.co/${sizes[ratio]}/d4af37/2D2D2D?text=${encodeURIComponent(text)}&font=plusjakartasans`;
    };

    const handleGenerate = async (promptText: string) => {
        const textToUse = promptText || input;
        if (textToUse.trim() === '') return;
        
        const newGenId = Date.now();
        const newGen: Generation = { 
          id: newGenId, 
          prompt: textToUse, 
          status: 'loading',
          aspectRatio: selectedRatio
        };
        setGenerations(prev => [...prev, newGen]);
        if (!promptText) setInput('');
        
        // Mock image generation
        setTimeout(() => {
            const imageUrl = getPlaceholderUrl(selectedRatio);
            setGenerations(prev => prev.map(g => g.id === newGenId ? { ...g, status: 'done', imageUrl } : g));
        }, 2500);
    };

    const handleDownload = (imageUrl: string, prompt: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `vision-${prompt.slice(0, 20).replace(/\s/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleGenerate(input);
      }
    };

    return (
        <div className="fixed inset-0 pt-[72px] flex flex-col bg-default-bg-primary/50 dark:bg-space-bg-primary/50 overflow-hidden">
            <main ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 min-h-0">
                 {generations.length === 0 ? (
                    <div className="min-h-full flex flex-col items-center justify-center text-center py-10">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: EASE_OUT }}>
                            <div className="relative inline-block mb-10">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }} className="mx-auto w-fit">
                                    <ImageIcon className="h-24 w-24 text-default-accent-gold" />
                                </motion.div>
                                <motion.div 
                                  animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
                                  transition={{ duration: 4, repeat: Infinity }}
                                  className="absolute inset-0 bg-default-accent-gold/20 blur-3xl rounded-full -z-10"
                                />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter dark:text-white">Image Synthesis</h1>
                            <p className="text-xl text-default-text-secondary dark:text-space-text-secondary mt-4 font-medium max-w-lg mx-auto leading-relaxed">
                              Translate descriptive vision into photorealistic assets with advanced spatial intelligence.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 w-full max-w-3xl px-4">
                            {[
                                { label: "Cyberpunk metropolis in eternal rain", icon: ImageIcon },
                                { label: "Abstract sculpture made of liquid gold", icon: Sparkles },
                                { label: "High-end jewelry macro photography", icon: Layers },
                                { label: "Hyper-realistic portrait of an android", icon: Sparkles }
                            ].map((p, i) => {
                                const PromptIcon = p.icon;
                                return (
                                  <motion.button 
                                      key={p.label}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: EASE_OUT }}
                                      whileHover={{ y: -4, borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleGenerate(p.label)}
                                      className="flex items-center gap-4 p-6 rounded-[24px] bg-white/60 dark:bg-space-card/60 backdrop-blur-xl border border-default-border dark:border-space-border text-left font-bold shadow-sm transition-all group"
                                  >
                                      <div className="p-3 rounded-xl bg-default-accent-gold/10 text-default-accent-gold group-hover:bg-default-accent-gold group-hover:text-white transition-all duration-300">
                                        <PromptIcon size={20} />
                                      </div>
                                      <span className="text-base line-clamp-1">{String(p.label)}</span>
                                  </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full space-y-12 py-8">
                        <AnimatePresence mode="popLayout">
                        {generations.map(gen => (
                            <motion.div 
                              key={gen.id} 
                              initial={{ opacity: 0, scale: 0.98, y: 30 }} 
                              animate={{ opacity: 1, scale: 1, y: 0 }} 
                              transition={{ duration: 0.6, ease: EASE_OUT }}
                              layout
                              className="space-y-6"
                            >
                                <div className="flex justify-end">
                                    <div className="max-w-[85%] p-5 rounded-[24px] bg-default-accent-gold text-white font-bold rounded-br-none shadow-xl text-base">
                                        {String(gen.prompt)}
                                        <span className="block text-[10px] mt-2 opacity-60 font-black uppercase tracking-widest">Ratio: {gen.aspectRatio}</span>
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    {gen.status === 'loading' && (
                                        <div className="aspect-square w-full max-w-[640px] mx-auto rounded-[40px] md:rounded-[56px] bg-white/60 dark:bg-space-card/60 backdrop-blur-3xl border border-default-border dark:border-space-border flex flex-col items-center justify-center p-12 text-center shadow-2xl">
                                            <div className="relative">
                                              <motion.div 
                                                animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                                                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} 
                                                className="w-20 h-20 border-4 border-default-accent-gold/20 border-t-default-accent-gold rounded-full" 
                                              />
                                              <Sparkles className="absolute inset-0 m-auto text-default-accent-gold animate-pulse" size={32} />
                                            </div>
                                            <p className="mt-10 font-black text-2xl tracking-tighter text-default-text-primary dark:text-white uppercase">Synthesizing Asset</p>
                                            <div className="w-56 h-2 bg-default-bg-secondary dark:bg-space-bg-primary mx-auto mt-8 rounded-full overflow-hidden">
                                              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} className="w-full h-full bg-default-accent-gold shadow-[0_0_15px_rgba(212,175,55,1)]" />
                                            </div>
                                        </div>
                                    )}
                                    {gen.status === 'done' && gen.imageUrl && (
                                        <motion.div 
                                          initial={{ opacity: 0 }} 
                                          animate={{ opacity: 1 }} 
                                          transition={{ duration: 1 }}
                                          className="p-4 md:p-6 rounded-[40px] md:rounded-[56px] bg-white/80 dark:bg-space-card/80 backdrop-blur-3xl border border-default-border dark:border-space-border shadow-2xl max-w-[640px] mx-auto"
                                        >
                                            <motion.div 
                                              initial={{ scale: 1.05, opacity: 0 }} 
                                              animate={{ scale: 1, opacity: 1 }} 
                                              transition={{ duration: 0.8, ease: EASE_OUT }}
                                              className="overflow-hidden rounded-[32px] md:rounded-[48px] shadow-inner"
                                            >
                                              <img 
                                                src={gen.imageUrl}
                                                alt={gen.prompt} 
                                                className="w-full h-auto object-cover"
                                                style={{ 
                                                  aspectRatio: gen.aspectRatio === '16:9' ? '16/9' : gen.aspectRatio === '9:16' ? '9/16' : '1/1'
                                                }}
                                              />
                                            </motion.div>
                                            <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8">
                                                <motion.button 
                                                  onClick={() => handleDownload(gen.imageUrl!, gen.prompt)}
                                                  whileHover={{ scale: 1.02, y: -2 }} 
                                                  whileTap={{ scale: 0.98 }}
                                                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-default-accent-gold text-white font-black rounded-[20px] shadow-xl transition-all text-base uppercase tracking-widest"
                                                >
                                                    <Download size={22}/> Download
                                                </motion.button>
                                                <motion.button 
                                                  whileHover={{ scale: 1.02, y: -2 }} 
                                                  whileTap={{ scale: 0.98 }}
                                                  onClick={() => handleGenerate(gen.prompt)}
                                                  className="flex-1 flex items-center justify-center gap-3 py-5 border-2 border-default-accent-gold text-default-accent-gold font-black rounded-[20px] hover:bg-default-accent-gold hover:text-white transition-all text-base uppercase tracking-widest"
                                                >
                                                    <RefreshCw size={22}/> Regenerate
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                    {gen.status === 'error' && (
                                        <div className="aspect-square w-full max-w-[640px] mx-auto rounded-[40px] md:rounded-[56px] bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center p-12 text-center shadow-2xl">
                                            <AlertTriangle className="w-20 h-20 text-red-500" />
                                            <p className="mt-8 font-black text-2xl text-red-600 dark:text-red-400 uppercase tracking-tighter">Engine Failure</p>
                                            <p className="text-lg text-default-text-secondary dark:text-space-text-secondary mt-3 font-medium">{gen.error}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            <footer className="w-full bg-white/40 dark:bg-space-bg-secondary/40 backdrop-blur-3xl border-t border-default-border dark:border-space-border px-4 py-6 md:px-8">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex items-center gap-2 px-2 overflow-x-auto pb-2 scrollbar-none">
                      {[
                        { id: '1:1', icon: Square, label: 'Square' },
                        { id: '16:9', icon: Monitor, label: 'Landscape' },
                        { id: '9:16', icon: Smartphone, label: 'Portrait' }
                      ].map(ratio => (
                        <button
                          key={ratio.id}
                          onClick={() => setSelectedRatio(ratio.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                            selectedRatio === ratio.id 
                            ? 'bg-default-accent-gold text-white shadow-lg' 
                            : 'bg-black/5 dark:bg-white/5 hover:bg-black/10'
                          }`}
                        >
                          <ratio.icon size={14} />
                          {ratio.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-end gap-3 md:gap-4">
                        <div className="flex-grow relative flex items-center bg-white dark:bg-space-card rounded-[28px] border-2 border-transparent focus-within:border-default-accent-gold transition-all overflow-hidden shadow-2xl">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe the scene in high fidelity..."
                                rows={1}
                                className="w-full bg-transparent p-4 md:p-6 pr-16 resize-none outline-none font-medium text-base dark:text-white"
                                style={{ minHeight: '64px' }}
                            />
                            <motion.button 
                              onClick={() => handleGenerate(input)} 
                              disabled={!input.trim()}
                              whileHover={input.trim() ? { scale: 1.1, rotate: 8 } : {}}
                              whileTap={input.trim() ? { scale: 0.9, rotate: -8 } : {}}
                              className={`absolute right-3 p-4 rounded-2xl transition-all ${
                                input.trim() 
                                ? 'bg-default-accent-gold text-white shadow-xl' 
                                : 'text-default-text-secondary opacity-30 cursor-not-allowed'
                              }`}
                            >
                                <Sparkles size={24}/>
                            </motion.button>
                        </div>
                    </div>
                    <p className="text-[11px] text-center text-default-text-secondary dark:text-space-text-secondary font-black uppercase tracking-[0.2em] opacity-40">
                      Vision Synthesis Engine v2.5 — Pro Assets
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ImageStudioPage;
