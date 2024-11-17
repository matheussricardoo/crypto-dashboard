'use client';
import { useState } from 'react';

export default function AdvancedFilters({ language, onApplyFilters }) {
  const [filters, setFilters] = useState({
    priceRange: {
      min: '',
      max: ''
    },
    marketCap: {
      min: '',
      max: ''
    },
    volume24h: {
      min: '',
      max: ''
    },
    priceChange: {
      min: '',
      max: ''
    }
  });

  const handleFilterChange = (category, field, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      marketCap: { min: '', max: '' },
      volume24h: { min: '', max: '' },
      priceChange: { min: '', max: '' }
    });
    onApplyFilters(null);
  };

  return (
    <div className="glass-effect rounded-lg p-6 mb-6">
      <h3 className="text-white text-lg mb-4">
        {language === 'pt' ? 'Filtros Avançados' : 'Advanced Filters'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro de Preço */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">
            {language === 'pt' ? 'Faixa de Preço (USD)' : 'Price Range (USD)'}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', 'min', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', 'max', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Filtro de Market Cap */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">
            {language === 'pt' ? 'Market Cap (USD)' : 'Market Cap (USD)'}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.marketCap.min}
              onChange={(e) => handleFilterChange('marketCap', 'min', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.marketCap.max}
              onChange={(e) => handleFilterChange('marketCap', 'max', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Filtro de Volume 24h */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">
            {language === 'pt' ? 'Volume 24h (USD)' : '24h Volume (USD)'}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.volume24h.min}
              onChange={(e) => handleFilterChange('volume24h', 'min', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.volume24h.max}
              onChange={(e) => handleFilterChange('volume24h', 'max', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Filtro de Variação de Preço */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">
            {language === 'pt' ? 'Variação de Preço (%)' : 'Price Change (%)'}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceChange.min}
              onChange={(e) => handleFilterChange('priceChange', 'min', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceChange.max}
              onChange={(e) => handleFilterChange('priceChange', 'max', e.target.value)}
              className="w-full bg-white/5 rounded-lg p-2 text-white text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={applyFilters}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 transition-colors text-sm"
        >
          {language === 'pt' ? 'Aplicar Filtros' : 'Apply Filters'}
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg p-2 transition-colors text-sm"
        >
          {language === 'pt' ? 'Limpar Filtros' : 'Clear Filters'}
        </button>
      </div>
    </div>
  );
} 