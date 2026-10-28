import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem } from '../utils/storage';

export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'lime' | 'emerald' | 'cyan' | 'orange' | 'violet' | 'pink' | 'red';

export interface AccentThemeConfig {
  id: AccentColor;
  name: string;
  hex: string;
  hoverHex: string;
  contrastText: string; // 'text-zinc-950' o 'text-white'
  // Clases utilitarias
  btnBg: string;
  btnHover: string;
  btnText: string;
  text: string;
  badgeBg: string;
  badgeBorder: string;
  borderFocus: string;
  glowShadow: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentThemeConfig> = {
  lime: {
    id: 'lime',
    name: 'Lima Neón (Original)',
    hex: '#ccff00',
    hoverHex: '#bbf200',
    contrastText: 'text-zinc-950',
    btnBg: 'bg-lime-400',
    btnHover: 'hover:bg-lime-300',
    btnText: 'text-zinc-950',
    text: 'text-lime-400',
    badgeBg: 'bg-lime-400/10',
    badgeBorder: 'border-lime-400/30',
    borderFocus: 'focus:border-lime-400',
    glowShadow: 'shadow-lime-400/20'
  },
  emerald: {
    id: 'emerald',
    name: 'Verde Esmeralda',
    hex: '#10b981',
    hoverHex: '#059669',
    contrastText: 'text-zinc-950',
    btnBg: 'bg-emerald-500',
    btnHover: 'hover:bg-emerald-400',
    btnText: 'text-zinc-950',
    text: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    borderFocus: 'focus:border-emerald-400',
    glowShadow: 'shadow-emerald-500/20'
  },
  cyan: {
    id: 'cyan',
    name: 'Azul Eléctrico / Cian',
    hex: '#06b6d4',
    hoverHex: '#0891b2',
    contrastText: 'text-zinc-950',
    btnBg: 'bg-cyan-400',
    btnHover: 'hover:bg-cyan-300',
    btnText: 'text-zinc-950',
    text: 'text-cyan-400',
    badgeBg: 'bg-cyan-400/10',
    badgeBorder: 'border-cyan-400/30',
    borderFocus: 'focus:border-cyan-400',
    glowShadow: 'shadow-cyan-400/20'
  },
  orange: {
    id: 'orange',
    name: 'Naranja Fuego',
    hex: '#f97316',
    hoverHex: '#ea580c',
    contrastText: 'text-white',
    btnBg: 'bg-orange-500',
    btnHover: 'hover:bg-orange-400',
    btnText: 'text-white',
    text: 'text-orange-400',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/30',
    borderFocus: 'focus:border-orange-400',
    glowShadow: 'shadow-orange-500/20'
  },
  violet: {
    id: 'violet',
    name: 'Púrpura / Violeta',
    hex: '#8b5cf6',
    hoverHex: '#7c3aed',
    contrastText: 'text-white',
    btnBg: 'bg-violet-500',
    btnHover: 'hover:bg-violet-400',
    btnText: 'text-white',
    text: 'text-violet-400',
    badgeBg: 'bg-violet-500/10',
    badgeBorder: 'border-violet-500/30',
    borderFocus: 'focus:border-violet-400',
    glowShadow: 'shadow-violet-500/20'
  },
  pink: {
    id: 'pink',
    name: 'Rosa Neón / Fucsia',
    hex: '#ec4899',
    hoverHex: '#db2777',
    contrastText: 'text-white',
    btnBg: 'bg-pink-500',
    btnHover: 'hover:bg-pink-400',
    btnText: 'text-white',
    text: 'text-pink-400',
    badgeBg: 'bg-pink-500/10',
    badgeBorder: 'border-pink-500/30',
    borderFocus: 'focus:border-pink-400',
    glowShadow: 'shadow-pink-500/20'
  },
  red: {
    id: 'red',
    name: 'Rojo Carmesí',
    hex: '#ef4444',
    hoverHex: '#dc2626',
    contrastText: 'text-white',
    btnBg: 'bg-red-500',
    btnHover: 'hover:bg-red-400',
    btnText: 'text-white',
    text: 'text-red-400',
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/30',
    borderFocus: 'focus:border-red-400',
    glowShadow: 'shadow-red-500/20'
  }
};

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  accent: AccentThemeConfig;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return getStoredItem<ThemeMode>('fittrack_theme_mode', 'dark');
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    return getStoredItem<AccentColor>('fittrack_accent_color', 'lime');
  });

  const isDark = themeMode === 'dark';
  const accent = ACCENT_PALETTES[accentColor] || ACCENT_PALETTES.lime;

  useEffect(() => {
    setStoredItem('fittrack_theme_mode', themeMode);
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [themeMode]);

  useEffect(() => {
    setStoredItem('fittrack_accent_color', accentColor);
    document.documentElement.style.setProperty('--color-accent-primary', accent.hex);
    document.documentElement.style.setProperty('--color-accent-hover', accent.hoverHex);
  }, [accentColor, accent]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  return (
    <ThemeContext.Provider value={{
      themeMode,
      setThemeMode,
      accentColor,
      setAccentColor,
      accent,
      isDark
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}
