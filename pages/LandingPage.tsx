import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  MessageSquare, Image as ImageIcon, Film, Palette, Check, ArrowDown, 
  Rocket, Edit3, Sparkles, Download, ArrowRight, Zap, Users, Globe, Star, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ScrollReveal, { EASE_OUT } from '../components/ScrollReveal';
import Scene from '../components/Scene';

interface CountUpProps {
  end: number;
  decimals?: number;
  suffix?: string;
}

const CountUp = ({ end, decimals = 0, suffix = '' }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const counter = setInterval(() => {
      start += 1;
      const progress = start / totalFrames;
      const current = end * (1 - Math.pow(1 - progress, 3));
      if (start >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(current);
      }
    }, frameDuration);
    return () => clearInterval(counter);
  }, [isInView, end]);

  return <span ref={ref}>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

interface MagneticButtonProps {
  // FIX: Made `children` optional to resolve TypeScript "missing children" errors in JSX.
  children?: React.ReactNode;
  className?: string;
  to?: string;
}

const MagneticButton = ({ children, className, to }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.2;
    const y = (clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };
  
  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });
  
  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
  
  return to ? <Link to={to}>{content}</Link> : content;
};

const PHRASES = ["Dream Bigger", "Build Smarter", "Innovate Faster", "Think Deeper", "Design Better", "Create More"];

const LandingPage = () => {
  const { user } = useAuth();
  const [dynamicIndex, setDynamicIndex] = useState(0);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-hidden font-sans bg-transparent">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 z-0 opacity-50 dark:opacity-70 pointer-events-none">
          <Scene />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-[0.9] mb-4"
          >
            <span className="block mb-2">Create Faster,</span>
            <div className="h-[1.2em] relative flex justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={PHRASES[dynamicIndex]}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                  className="absolute text-transparent bg-clip-text bg-gradient-to-r from-default-accent-gold via-yellow-400 to-default-accent-peach animate-gradient-text bg-[200%_auto] pb-4"
                >
                  {PHRASES[dynamicIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT }}
            className="mt-10 text-xl md:text-2xl text-default-text-secondary dark:text-space-text-secondary max-w-2xl mx-auto font-medium"
          >
            Vision is your premium AI-powered creative studio. Transform thoughts into high-fidelity visual and conversational masterpieces.
          </motion.p>
          
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
            <ScrollReveal direction="up" distance={30} delay={0.4} scale={0.95}>
              <MagneticButton to={user ? "/chat-studio" : "/signin"} className="px-10 py-5 bg-default-accent-gold text-white font-bold rounded-full shadow-2xl transition-all flex items-center gap-3 text-lg group">
                <MessageSquare size={24} className="group-hover:rotate-12 transition-transform duration-300" /> Chat Studio
              </MagneticButton>
            </ScrollReveal>
            <ScrollReveal direction="up" distance={30} delay={0.5} scale={0.95}>
              <MagneticButton to={user ? "/image-studio" : "/signin"} className="px-10 py-5 border-2 border-default-accent-gold text-default-accent-gold dark:border-space-accent-cyan dark:text-space-accent-cyan font-bold rounded-full hover:bg-default-accent-gold hover:text-white dark:hover:bg-space-accent-cyan dark:hover:text-space-bg-primary transition-all flex items-center gap-3 text-lg group">
                <ImageIcon size={24} className="group-hover:scale-110 transition-transform duration-300" /> Image Studio
              </MagneticButton>
            </ScrollReveal>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-default-accent-gold"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={32} />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter">Powerful Features</h2>
            <div className="w-24 h-1.5 bg-default-accent-gold mx-auto rounded-full" />
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { icon: MessageSquare, title: 'AI Chat Studio', desc: 'Conversational AI that understands context and helps you create amazing content.', side: 'left' },
            { icon: ImageIcon, title: 'Image Generation', desc: 'Transform your ideas into stunning visuals with AI-powered image generation in seconds.', side: 'right' },
            { icon: Film, title: 'Script Writing', desc: 'Write video scripts, podcast outlines, and content plans effortlessly with AI assistance.', side: 'left' },
            { icon: Palette, title: 'Design Assets', desc: 'Create thumbnails, covers, and graphics for all your creative projects.', side: 'right' }
          ].map((f, i) => (
            <ScrollReveal key={f.title} direction={f.side as any} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="glass-card p-12 h-full rounded-[48px] border border-default-border dark:border-space-border group hover:border-default-accent-gold/50 shadow-sm"
              >
                <div className="p-5 bg-default-accent-gold/10 dark:bg-space-accent-cyan/10 rounded-3xl w-fit group-hover:scale-110 transition-transform duration-500">
                  <f.icon size={52} className="text-default-accent-gold dark:text-space-accent-cyan" />
                </div>
                <h3 className="text-3xl font-extrabold mt-10 mb-5 tracking-tight">{f.title}</h3>
                <p className="text-lg text-default-text-secondary dark:text-space-text-secondary leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-40 bg-default-bg-secondary dark:bg-space-bg-secondary relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter">Four Simple Steps</h2>
              <p className="text-xl text-default-text-secondary max-w-xl mx-auto font-medium font-sans">A professional journey from spark to masterpiece.</p>
            </div>
          </ScrollReveal>
          
          <div className="relative">
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.2 }}
              className="absolute left-[39px] top-0 bottom-0 w-1 bg-default-accent-gold/20 origin-top hidden md:block" 
            />
            <div className="space-y-24">
              {[
                { num: '01', icon: Rocket, title: 'Choose Your Studio', desc: 'Select Chat for text or Image for visual creation.', side: 'left' },
                { num: '02', icon: Edit3, title: 'Describe Your Vision', desc: 'Communicate what you want to create in natural language.', side: 'right' },
                { num: '03', icon: Sparkles, title: 'AI Does the Magic', desc: 'Our advanced models generate high-fidelity results in seconds.', side: 'left' },
                { num: '04', icon: Download, title: 'Download & Share', desc: 'Get your content instantly for use in any project.', side: 'right' }
              ].map((s, i) => (
                <ScrollReveal key={s.num} direction={s.side as any} scale={0.97} delay={i * 0.15}>
                  <div className="flex flex-col md:flex-row gap-10 items-start relative group">
                    <motion.div 
                      initial={{ scale: 0.7, rotate: -180, opacity: 0 }}
                      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: i * 0.15 + 0.1 }}
                      className="relative z-10 w-20 h-20 bg-default-accent-gold rounded-full flex items-center justify-center text-white text-3xl font-black shrink-0 shadow-2xl"
                    >
                      {s.num}
                    </motion.div>
                    <div className="glass-card p-10 rounded-[32px] border border-default-border dark:border-space-border flex-grow shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center gap-5 mb-5">
                        <s.icon size={36} className="text-default-accent-gold" />
                        <h3 className="text-3xl font-bold tracking-tight">{s.title}</h3>
                      </div>
                      <p className="text-xl text-default-text-secondary dark:text-space-text-secondary leading-relaxed font-medium">{s.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Built for Creators Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter">Built for Creators</h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {[
            { role: 'Designers', icon: '🎨', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop', desc: 'Explore concepts and iterate on designs with AI assistance.' },
            { role: 'Content Creators', icon: '🎥', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop', desc: 'Write scripts and brainstorm ideas for your content projects.' },
            { role: 'Marketers', icon: '📢', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', desc: 'Create ad copy and design social posts with AI tools.' },
            { role: 'Entrepreneurs', icon: '💼', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', desc: 'Build plans and branding for your startup effortlessly.' }
          ].map((uc, i) => (
            <ScrollReveal key={uc.role} direction="up" scale={0.98} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -12, scale: 1.01 }}
                className="group h-full overflow-hidden rounded-[56px] bg-white dark:bg-space-card border border-default-border dark:border-space-border shadow-2xl flex flex-col transition-all duration-400"
              >
                <div className="h-80 overflow-hidden relative">
                  <motion.img 
                    initial={{ scale: 1.15 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1, ease: EASE_OUT }}
                    src={uc.img} alt={uc.role} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="absolute top-8 left-8 w-20 h-20 bg-white dark:bg-space-card rounded-3xl flex items-center justify-center text-4xl shadow-2xl"
                  >
                    {uc.icon}
                  </motion.div>
                </div>
                <div className="p-12 flex-grow">
                  <h3 className="text-4xl font-extrabold mb-5 tracking-tight">{uc.role}</h3>
                  <p className="text-xl text-default-text-secondary dark:text-space-text-secondary mb-10 leading-relaxed font-medium">{uc.desc}</p>
                  <div className="mt-auto pt-10 border-t border-default-border dark:border-space-border">
                    <Link to={user ? "/chat-studio" : "/signin"} className="text-default-accent-gold font-bold text-lg flex items-center gap-3 group/link">
                      Explore <ArrowRight size={22} className="group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-40 bg-default-accent-gold/5 dark:bg-space-accent-cyan/5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-16 text-center">
          {[
            { icon: Users, end: 1200, suffix: '+', label: 'Active Creators' },
            { icon: Sparkles, end: 15000, suffix: '+', label: 'Assets Created' },
            { icon: Star, end: 4.8, suffix: '/5', label: 'Satisfaction', decimals: 1 }
          ].map((s, i) => (
            <ScrollReveal key={s.label} direction="none" scale={0.9} delay={i * 0.1}>
              <div className="group">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: i * 0.1 + 0.1 }}
                  className="w-20 h-20 bg-default-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                >
                  <s.icon size={44} className="text-default-accent-gold" />
                </motion.div>
                <div className="text-7xl font-black mb-3 tracking-tighter text-default-text-primary dark:text-space-text-primary">
                  <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="text-default-text-secondary uppercase tracking-[0.2em] font-black text-xs">{s.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-48 px-6 text-center relative overflow-hidden">
        <ScrollReveal direction="up" distance={40} scale={0.97}>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-9xl font-extrabold mb-12 tracking-tighter leading-tight">Ready to Create<br/>the Future?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
              <MagneticButton to={user ? "/chat-studio" : "/signin"} className="px-14 py-7 bg-default-accent-gold text-white font-bold rounded-full shadow-2xl transition-all text-xl">
                Start Your Journey
              </MagneticButton>
              <div className="text-default-text-secondary font-bold text-lg">No credit card required.</div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer Letter */}
      <div className="pb-32 flex flex-col items-center">
        <motion.button 
          onClick={() => setShowLetter(!showLetter)}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="group relative p-5 bg-white dark:bg-space-card rounded-full shadow-2xl border border-default-border dark:border-space-border"
        >
          <Mail className={`text-default-accent-gold transition-transform duration-500 ${showLetter ? 'rotate-[360deg] scale-0' : 'scale-100'}`} size={32} />
          {showLetter && <span className="absolute inset-0 flex items-center justify-center text-default-accent-gold text-3xl font-bold">×</span>}
        </motion.button>
        <AnimatePresence>
          {showLetter && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="mt-10 max-w-sm mx-auto p-10 glass-card rounded-[40px] border border-default-accent-gold/30 text-center relative shadow-2xl"
            >
              <p className="text-default-text-primary dark:text-space-text-primary leading-relaxed text-xl italic font-medium">
                "We are truly grateful for your presence. Vision exists for dreamers like you. Thank you for trusting your creative spark with us."
              </p>
              <div className="mt-8 text-sm text-default-accent-gold font-black tracking-[0.3em] uppercase">— The Vision Team</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
};

export default LandingPage;