'use client';
import { translations } from '@/utils/translations';
import { StarIcon } from './icons';

export default function CryptoCard({ crypto, language, isFavorite, onToggleFavorite }) {
  const priceChange = crypto.price_change_percentage_24h;
  const isPositive = priceChange > 0;
  const t = translations[language];

  return (
    <div className="crypto-card p-6 rounded-lg relative overflow-hidden">      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt={crypto.name} className="w-8 h-8 relative" />
          <div>
            <h2 className="font-medium text-white">{crypto.name}</h2>
            <span className="text-xs text-zinc-400 uppercase">{crypto.symbol}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' 
                : 'text-zinc-400 hover:text-yellow-400 hover:bg-white/5'
            }`}
          >
            <StarIcon filled={isFavorite} />
          </button>
          <div className={`px-3 py-1 rounded-full text-xs ${
            isPositive 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-red-500/10 text-red-400'
          }`}>
            {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-semibold text-white">
          ${crypto.current_price.toLocaleString()}
        </p>
        <div className="flex justify-between text-sm text-zinc-400">
          <span>{t.volume}</span>
          <span>${crypto.total_volume.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-400">
          <span>{t.marketCap}</span>
          <span>${crypto.market_cap.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
} 