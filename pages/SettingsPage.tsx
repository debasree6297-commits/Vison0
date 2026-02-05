import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Check, LogOut, CheckCircle } from 'lucide-react';

// FIX: Add `as const` to ensure TypeScript infers this as a tuple, not a `number[]`, which resolves framer-motion type errors.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_BOUNCE = [0.34, 1.56, 0.64, 1] as const;

const AVATAR_SEEDS = ['Zen', 'Smile', 'Peace', 'Aura', 'Glow', 'Calm'];

// FIX: Refactored from `React.FC` to a standard function to resolve framer-motion type errors.
const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, updateUser, signOut } = useAuth();
    const avatarSectionRef = useRef(null);
    const isInView = useInView(avatarSectionRef, { amount: 0.3, once: true });

    const handleAvatarSelect = async (id: number) => {
        if (user && user.avatarId !== id) {
            await updateUser({ avatarId: id });
        }
    };
    
    const getAvatarUrl = (id: number) => {
        const seed = AVATAR_SEEDS[id - 1] || AVATAR_SEEDS[0];
        return `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}`;
    };

    const avatarGridVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.06,
          delayChildren: 0.2,
        },
      },
    };

    const avatarItemVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            // FIX: Removed `ease` property from `spring` transition, as it's not compatible and causes type errors.
            transition: { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.5 }
        },
    };

    return (
        <div className="max-w-4xl mx-auto py-24 px-6 pt-32 min-h-screen">
            <motion.h1 
                initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter"
            >
                Settings
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-20">
                <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest text-default-text-secondary">Theme Preference</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ThemeCard name="Default" icon={Sun} selected={theme === 'default'} onClick={() => theme !== 'default' && toggleTheme()} delay={0.3} side="left" />
                    <ThemeCard name="Space" icon={Moon} selected={theme === 'space'} onClick={() => theme !== 'space' && toggleTheme()} delay={0.4} side="right" />
                </div>
            </motion.div>
            
            {user && (
                 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-20">
                     <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest text-default-text-secondary">Profile</h2>
                     <div className="glass-card p-10 rounded-[40px] border border-default-border dark:border-space-border flex flex-col sm:flex-row items-center gap-10 shadow-xl">
                         <motion.img 
                          key={user.avatarId}
                          initial={{ opacity: 0, scale: 0.8 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          transition={{ delay: 0.1, type: 'spring' }}
                          src={getAvatarUrl(user.avatarId)} 
                          alt="User" 
                          className="w-32 h-32 rounded-full border-4 border-default-accent-gold shadow-2xl"
                         />
                         <div className="text-center sm:text-left">
                            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.75 }} className="text-4xl font-black mb-2 tracking-tight">{user.name}</motion.p>
                            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="text-xl text-default-text-secondary mb-4">{user.email}</motion.p>
                            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.85 }} className="inline-block text-xs font-black bg-blue-500/10 text-blue-500 py-2 px-5 rounded-full uppercase tracking-widest">Supabase Account</motion.span>
                         </div>
                     </div>
                 </motion.div>
            )}

             <motion.div ref={avatarSectionRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mb-20">
                <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest text-default-text-secondary">Choose Avatar</h2>
                <motion.div
                    variants={avatarGridVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-2 md:grid-cols-3 gap-8"
                >
                    {AVATAR_SEEDS.map((seed, index) => {
                        const id = index + 1;
                        const isSelected = user?.avatarId === id;
                        return (
                            <motion.div
                                key={id}
                                variants={avatarItemVariants}
                                onClick={() => handleAvatarSelect(id)}
                                className="relative cursor-pointer aspect-square"
                            >
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                        duration: 3 + id * 0.3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    whileHover={{
                                        y: -8,
                                        scale: 1.05,
                                        filter: 'drop-shadow(0 10px 15px rgba(212, 175, 55, 0.3))',
                                        transition: { duration: 0.2, ease: 'easeOut' }
                                    }}
                                    className="relative rounded-full p-1 w-full h-full"
                                >
                                    <motion.div
                                      animate={{ scale: isSelected ? [1, 1.06, 1] : 1 }}
                                      transition={{ duration: 0.4, ease: EASE_BOUNCE }}
                                      className={`w-full h-full p-2 rounded-full transition-all duration-300 bg-default-bg-secondary dark:bg-space-card shadow-inner ${isSelected ? 'ring-4 ring-offset-2 ring-offset-default-bg-primary dark:ring-offset-space-bg-primary ring-default-accent-gold' : ''}`}
                                    >
                                      <img src={`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}`} alt={`Avatar ${id}`} className="w-full h-full rounded-full" />
                                    </motion.div>
                                    <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 180 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                                            className="absolute -top-2 -right-2 bg-default-accent-gold text-white rounded-full p-2 shadow-xl border-4 border-white dark:border-space-card"
                                        >
                                            <Check className="w-5 h-5" strokeWidth={3} />
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </motion.div>
             </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex flex-col items-center gap-6">
                 <motion.button 
                  onClick={signOut} 
                  whileHover={{ y: -4 }}
                  className="w-full max-w-sm h-16 rounded-full font-black text-xl flex items-center justify-center gap-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                 >
                    <LogOut size={24} /> Logout
                </motion.button>
             </motion.div>
        </div>
    );
};

// FIX: Refactored from an untyped component to a standard function with typed props to resolve framer-motion type errors.
// FIX: Changed icon type from React.ElementType to a more specific React.ComponentType to resolve type errors.
const ThemeCard = ({ name, icon: Icon, selected, onClick, delay, side }: { name: string, icon: React.ComponentType<{ size?: number; className?: string; }>, selected: boolean, onClick: () => void, delay: number, side: 'left' | 'right' }) => (
    <motion.div 
        initial={{ opacity: 0, x: side === 'left' ? -40 : 40, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, ease: EASE_OUT }}
        onClick={onClick}
        whileHover={{ y: -8, scale: 1.02 }}
        className={`p-10 rounded-[32px] cursor-pointer border-2 transition-all duration-400 group relative overflow-hidden ${selected ? 'border-default-accent-gold bg-default-accent-gold/5 shadow-2xl' : 'border-default-border'}`}
    >
        <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-6">
                <Icon size={40} className={selected ? 'text-default-accent-gold' : ''} />
                <span className="text-3xl font-black">{name}</span>
            </div>
            <AnimatePresence>
              {selected && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1.2 }} 
                  exit={{ scale: 0 }} 
                  transition={{ type: 'spring' }} 
                  className="w-8 h-8 rounded-full bg-default-accent-gold flex items-center justify-center text-white"
                >
                  <Check size={20} strokeWidth={4} />
                </motion.div>
              )}
            </AnimatePresence>
        </div>
    </motion.div>
);

export default SettingsPage;