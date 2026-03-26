'use client';
import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('pokopia-theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev: Theme) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  return { theme, toggleTheme };
}
