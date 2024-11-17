import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('cryptoFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (cryptoId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(cryptoId)
        ? prev.filter(id => id !== cryptoId)
        : [...prev, cryptoId];
      
      localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return [favorites, toggleFavorite];
} 