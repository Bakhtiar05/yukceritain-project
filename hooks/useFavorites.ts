import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('event_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        setFavorites([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      let newFavs;
      if (prev.includes(eventId)) {
        newFavs = prev.filter(id => id !== eventId);
      } else {
        newFavs = [...prev, eventId];
      }
      localStorage.setItem('event_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (eventId: string) => favorites.includes(eventId);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
