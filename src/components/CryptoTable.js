'use client';
import { useState } from 'react';
import { StarIcon } from './icons';

export default function CryptoTable({ cryptos, language, onToggleFavorite, favorites }) {
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortedCryptos = () => {
    const sorted = [...cryptos].sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    });
    return sorted;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-white/10">
            <th className="p-4">
              <span className="text-xs text-zinc-400">
                {language === 'pt' ? 'Favorito' : 'Favorite'}
              </span>
            </th>
            <th 
              className="p-4 cursor-pointer hover:bg-white/5"
              onClick={() => handleSort('name')}
            >
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                {language === 'pt' ? 'Nome' : 'Name'} {getSortIcon('name')}
              </span>
            </th>
            <th 
              className="p-4 cursor-pointer hover:bg-white/5"
              onClick={() => handleSort('current_price')}
            >
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                {language === 'pt' ? 'Preço' : 'Price'} {getSortIcon('current_price')}
              </span>
            </th>
            <th 
              className="p-4 cursor-pointer hover:bg-white/5"
              onClick={() => handleSort('price_change_percentage_24h')}
            >
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                24h % {getSortIcon('price_change_percentage_24h')}
              </span>
            </th>
            <th 
              className="p-4 cursor-pointer hover:bg-white/5"
              onClick={() => handleSort('market_cap')}
            >
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                Market Cap {getSortIcon('market_cap')}
              </span>
            </th>
            <th 
              className="p-4 cursor-pointer hover:bg-white/5"
              onClick={() => handleSort('total_volume')}
            >
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                Volume 24h {getSortIcon('total_volume')}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {getSortedCryptos().map((crypto) => (
            <tr 
              key={crypto.id} 
              className="border-b border-white/5 hover:bg-white/5"
            >
              <td className="p-4">
                <button
                  onClick={() => onToggleFavorite(crypto.id)}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    favorites.includes(crypto.id)
                      ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                      : 'text-zinc-400 hover:text-yellow-400 hover:bg-white/5'
                  }`}
                >
                  <StarIcon filled={favorites.includes(crypto.id)} />
                </button>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                  <div>
                    <div className="font-medium text-white">{crypto.name}</div>
                    <div className="text-xs text-zinc-400">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-white">
                ${crypto.current_price.toLocaleString()}
              </td>
              <td className={`p-4 ${
                crypto.price_change_percentage_24h > 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="p-4 text-white">
                ${(crypto.market_cap / 1e9).toFixed(2)}B
              </td>
              <td className="p-4 text-white">
                ${(crypto.total_volume / 1e9).toFixed(2)}B
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 