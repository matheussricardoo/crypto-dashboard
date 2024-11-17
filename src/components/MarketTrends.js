'use client';
import { useState, useEffect } from 'react';
import { translations } from '@/utils/translations';

export default function MarketTrends({ language }) {
  const [trends, setTrends] = useState({
    topGainers: [],
    topLosers: [],
    highestVolume: []
  });

  const t = translations[language];

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('/api/crypto');
        const data = await response.json();
        
        const sorted = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        const volumeSorted = [...data].sort((a, b) => b.total_volume - a.total_volume);

        setTrends({
          topGainers: sorted.slice(0, 3),
          topLosers: sorted.slice(-3).reverse(),
          highestVolume: volumeSorted.slice(0, 3)
        });
      } catch (error) {
        console.error('Erro ao buscar tendências:', error);
      }
    };

    fetchTrends();
    const interval = setInterval(fetchTrends, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="glass-effect rounded-lg p-4">
        <h3 className="text-white text-sm mb-3">
          {language === 'pt' ? '🚀 Maiores Altas' : '🚀 Top Gainers'}
        </h3>
        {trends.topGainers.map((coin) => (
          <div key={coin.id} className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span className="text-zinc-300">{coin.symbol.toUpperCase()}</span>
            </div>
            <span className="text-green-400">
              +{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-lg p-4">
        <h3 className="text-white text-sm mb-3">
          {language === 'pt' ? '📉 Maiores Quedas' : '📉 Top Losers'}
        </h3>
        {trends.topLosers.map((coin) => (
          <div key={coin.id} className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span className="text-zinc-300">{coin.symbol.toUpperCase()}</span>
            </div>
            <span className="text-red-400">
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-lg p-4">
        <h3 className="text-white text-sm mb-3">
          {language === 'pt' ? '💎 Maior Volume' : '💎 Highest Volume'}
        </h3>
        {trends.highestVolume.map((coin) => (
          <div key={coin.id} className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span className="text-zinc-300">{coin.symbol.toUpperCase()}</span>
            </div>
            <span className="text-zinc-400">
              ${(coin.total_volume / 1e9).toFixed(2)}B
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 