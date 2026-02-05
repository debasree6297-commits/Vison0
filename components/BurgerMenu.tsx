import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, MessageSquare, ImageIcon, Settings, Info, LogOut, ArrowRight } from 'lucide-react';

interface BurgerMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AVATAR_SEEDS = ['Zen', 'Smile', 'Peace', 'Aura', 'Glow', 'Calm'];

// FIX: Add `as const` to ensure TypeScript infers this as a tuple, not a `number[]`, which resolves framer-motion type errors.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// FIX: Refactored from `React.FC` to a standard function with typed props to resolve framer-motion type errors.
const BurgerMenu = ({ isOpen, setIsOpen }: BurgerMenuProps) => {
    const { user, signOut } = useAuth();
    const location = useLocation();

    const getAvatarUrl = (id: number) => {
        const seed = AVATAR_SEEDS[id - 1] || AVATAR_SEEDS[0];
        return `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}`;
    };

    const menuItems = [
        { name: 'Chat Studio', path: '/chat-studio', icon: MessageSquare, auth: true },
        { name: 'Image Studio', path: '/image-studio', icon: ImageIcon, auth: true },
        { name: 'Settings', path: '/settings', icon: Settings, auth: true },
        { name: 'About', path: '/about', icon: Info, auth: false },
    ];
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                        className="fixed top-0 right-0 h-full w-[90%] max-w-sm bg-white dark:bg-space-bg-secondary border-l border-default-border dark:border-space-border shadow-2xl z-[9999] flex flex-col"
                    >
                        <div className="p-6 bg-default-accent-gold/5 border-b border-default-border dark:border-space-border flex items-center justify-between">
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: 0.2, duration: 0.4, ease: EASE_OUT }}
                            >
                                {user ? (
                                    <div className="flex items-center gap-4">
                                         <img src={getAvatarUrl(user.avatarId)} alt="User" className="w-14 h-14 rounded-full border-2 border-default-accent-gold shadow-md" />
                                         <div>
                                             <p className="text-xl font-bold leading-tight">{user.name}</p>
                                             <p className="text-sm text-default-text-secondary">{user.email}</p>
                                         </div>
                                    </div>
                                ) : (
                                    <p className="text-2xl font-black tracking-tight">Menu</p>
                                )}
                            </motion.div>
                             <motion.button 
                                whileHover={{ scale: 1.1, rotate: 90 }} 
                                onClick={() => setIsOpen(false)} 
                                className="p-3 rounded-full bg-default-accent-gold/10 hover:bg-default-accent-gold/20 transition-all"
                             >
                                <X size={24} />
                            </motion.button>
                        </div>
                        <nav className="flex-grow p-4">
                            <ul className="space-y-2">
                                {menuItems.map((item, i) => (
                                    <motion.li
                                        key={item.name}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + i * 0.06, duration: 0.35, ease: EASE_OUT }}
                                    >
                                        <Link
                                            to={(!item.auth || user) ? item.path || '#' : '#'}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center justify-between p-5 text-xl font-bold rounded-2xl transition-all duration-300 ${location.pathname === item.path ? 'bg-default-accent-gold/10 text-default-accent-gold' : 'hover:bg-black/5 hover:translate-x-2'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon size={26} className={location.pathname === item.path ? 'animate-pulse' : ''} />
                                                <span>{item.name}</span>
                                            </div>
                                            <ArrowRight size={20} className={`transition-all duration-300 ${location.pathname === item.path ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>
                        {user && (
                            <div className="p-6 border-t border-default-border dark:border-space-border">
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.4, ease: EASE_OUT }}
                                    whileHover={{ y: -4 }}
                                    onClick={() => { signOut(); setIsOpen(false); }}
                                    className="w-full flex items-center justify-center gap-3 p-5 text-lg font-bold rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    <LogOut size={24}/> Logout
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BurgerMenu;