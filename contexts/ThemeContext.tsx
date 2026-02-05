
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// FIX: Made the 'children' prop optional to resolve a TypeScript error where it was not being correctly inferred.
export const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme && (storedTheme === 'default' || storedTheme === 'space')) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.warn('Could not access localStorage to retrieve theme.', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (theme === 'space') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Could not access localStorage to set theme.', error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'default' ? 'space' : 'default'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};