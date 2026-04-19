'use client';

import { ReactNode, useEffect, useState, createContext, useContext } from 'react';

export const DarkModeContext = createContext<{ darkMode: boolean; toggleDarkMode: () => void } | null>(null);

export default function DarkModeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('darkMode');
    const isDark = saved ? JSON.parse(saved) : false;
    setDarkMode(isDark);
    applyDarkMode(isDark);
  }, []);

  const applyDarkMode = (isDark: boolean) => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
    } else {
      html.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    applyDarkMode(newDarkMode);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen transition-colors duration-300"
          style={{
            backgroundColor: darkMode ? '#111827' : '#ffffff',
            color: darkMode ? '#f3f4f6' : '#111827'
          }}
        >
          {children}
        </div>
      </div>
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}
