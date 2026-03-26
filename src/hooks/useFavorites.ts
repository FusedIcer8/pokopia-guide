'use client';
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('pokopia-favorites', []);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev: string[]) =>
        prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
      );
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
}
