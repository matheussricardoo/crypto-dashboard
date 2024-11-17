'use client';
import { useState, useEffect } from 'react';

export default function MarketStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/crypto');
        const data = await response.json();
        
        const totalMarketCap = data.reduce((acc, coin) => acc + coin.market_cap, 0);
        const total24hVolume = data.reduce((acc, coin) => acc + coin.total_volume, 0);
        const dominance = (data[0].market_cap / totalMarketCap) * 100;

        setStats({
          totalMarketCap,
          total24hVolume,
          dominance,
          totalCoins: data.length
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="glass-effect rounded-lg p-4">
        <p className="text-xl font-medium text-white">
          ${(stats.totalMarketCap / 1e9).toFixed(2)}B
        </p>
        <h3 className="text-zinc-400 text-sm">Market Cap Total</h3>
      </div>
      <div className="glass-effect rounded-lg p-4">
        <p className="text-xl font-medium text-white">
          ${(stats.total24hVolume / 1e9).toFixed(2)}B
        </p>
        <h3 className="text-zinc-400 text-sm">Volume 24h</h3>
      </div>
      <div className="glass-effect rounded-lg p-4">
        <p className="text-xl font-medium text-white">
          {stats.dominance.toFixed(1)}%
        </p>
        <h3 className="text-zinc-400 text-sm">Dominância BTC</h3>
      </div>
      <div className="glass-effect rounded-lg p-4">
        <p className="text-xl font-medium text-white">
          {stats.totalCoins}
        </p>
        <h3 className="text-zinc-400 text-sm">Criptomoedas</h3>
      </div>
    </div>
  );
} 