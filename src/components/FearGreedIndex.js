'use client';
import { useState, useEffect } from 'react';

export default function FearGreedIndex() {
  const [fgi, setFgi] = useState(null);

  useEffect(() => {
    const fetchFGI = async () => {
      try {
        const response = await fetch('/api/fear-greed');
        const data = await response.json();
        setFgi(data.data[0]);
      } catch (error) {
        console.error('Erro ao buscar índice de medo e ganância:', error);
      }
    };

    fetchFGI();
    const interval = setInterval(fetchFGI, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  if (!fgi) return null;

  const getColor = (value) => {
    if (value <= 25) return 'text-red-500';
    if (value <= 45) return 'text-orange-500';
    if (value <= 55) return 'text-yellow-500';
    if (value <= 75) return 'text-green-500';
    return 'text-green-600';
  };

  return (
    <div className="glass-effect rounded-xl p-4">
      <h3 className="text-white text-lg mb-2">Índice de Medo e Ganância</h3>
      <div className={`text-3xl font-bold ${getColor(fgi.value)}`}>
        {fgi.value}
      </div>
      <div className="text-sm text-zinc-400">{fgi.value_classification}</div>
    </div>
  );
} 