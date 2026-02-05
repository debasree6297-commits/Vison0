import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import Logo from './icons/Logo';
import BurgerMenu from './BurgerMenu';

const AVATAR_SEEDS = ['Zen', 'Smile', 'Peace', 'Aura', 'Glow', 'Calm'];

// FIX: Refactored from `React.FC` to a standard function to resolve framer-motion type errors.
const Header = () => {
    const { user, signOut } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isBurgerOpen, setBurgerOpen] = useState(false);

    const getAvatarUrl = (id: number) => {
        const seed = AVATAR_SEEDS[id - 1] || AVATAR_SEEDS[0];
        return `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}`;
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-[72px] bg-white/80 dark:bg-space-bg-secondary/80 backdrop-blur-xl border-b border-default-border dark:border-space-border z-50">
                <nav className="max-w-screen-xl mx-auto px-6 h-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <Logo className="h-10 w-10 text-default-accent-gold" />
                        <span className="text-xl font-bold text-default-accent-gold hidden sm:block">Vision</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <img src={getAvatarUrl(user.avatarId)} alt="User Avatar" className="w-9 h-9 rounded-full border-2 border-default-accent-gold" />
                                    <span className="hidden md:inline font-semibold">{user.name}</span>
                                    <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-60 bg-white dark:bg-space-card rounded-lg shadow-xl border border-default-border dark:border-space-border overflow-hidden"
                                        >
                                           <div className="p-4 border-b border-default-border dark:border-space-border">
                                                <img src={getAvatarUrl(user.avatarId)} alt="User Avatar" className="w-12 h-12 rounded-full mx-auto" />
                                                <p className="font-bold text-center mt-2">{user.name}</p>
                                                <p className="text-sm text-default-text-secondary dark:text-space-text-secondary text-center">{user.email}</p>
                                           </div>
                                            <ul>
                                                <li><Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><Settings size={18} /> Settings</Link></li>
                                                <li><button onClick={() => { signOut(); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors"><LogOut size={18} /> Logout</button></li>
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/signin" className="text-default-accent-gold font-semibold hover:underline underline-offset-4 hidden md:block">
                                Sign In
                            </Link>
                        )}

                        <button onClick={() => setBurgerOpen(true)} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <Menu size={24} className="text-default-accent-gold" />
                        </button>
                    </div>
                </nav>
            </header>
            <BurgerMenu isOpen={isBurgerOpen} setIsOpen={setBurgerOpen} />
        </>
    );
};

export default Header;