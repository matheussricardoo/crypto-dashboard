'use client';

import { useState, useEffect } from 'react';
import CryptoCard from '@/components/CryptoCard';
import { translations } from '@/utils/translations';
import MarketStats from '@/components/MarketStats';
import Header from '@/components/Header';
import MarketTrends from '@/components/MarketTrends';
import CryptoCalculator from '@/components/CryptoCalculator';
import CryptoComparison from '@/components/CryptoComparison';
import AdvancedFilters from '@/components/AdvancedFilters';
import CryptoTable from '@/components/CryptoTable';
import { useFavorites } from '@/hooks/useFavorites';
import { StarIcon, GridIcon, TableIcon } from '@/components/icons';

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [language, setLanguage] = useState('pt');
  const t = translations[language];
  const [activeFilters, setActiveFilters] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favorites, toggleFavorite] = useFavorites();

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch('/api/crypto');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && Array.isArray(data)) {
          const sortedData = data.sort((a, b) => b.current_price - a.current_price);
          setCryptos(sortedData);
        } else {
          console.error('Dados inválidos recebidos da API');
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    };

    fetchCryptos();
    const interval = setInterval(fetchCryptos, 30000);
    return () => clearInterval(interval);
  }, []);

  const sortOptions = {
    price: (a, b) => b.current_price - a.current_price,
    price_asc: (a, b) => a.current_price - b.current_price,
    market_cap: (a, b) => b.market_cap - a.market_cap,
    change: (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    volume: (a, b) => b.total_volume - a.total_volume,
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const applyAdvancedFilters = (cryptos) => {
    if (!activeFilters) return cryptos;

    return cryptos.filter(crypto => {
      const meetsPrice = (!activeFilters.priceRange.min || crypto.current_price >= Number(activeFilters.priceRange.min)) &&
                        (!activeFilters.priceRange.max || crypto.current_price <= Number(activeFilters.priceRange.max));

      const meetsMarketCap = (!activeFilters.marketCap.min || crypto.market_cap >= Number(activeFilters.marketCap.min)) &&
                            (!activeFilters.marketCap.max || crypto.market_cap <= Number(activeFilters.marketCap.max));

      const meetsVolume = (!activeFilters.volume24h.min || crypto.total_volume >= Number(activeFilters.volume24h.min)) &&
                         (!activeFilters.volume24h.max || crypto.total_volume <= Number(activeFilters.volume24h.max));

      const meetsPriceChange = (!activeFilters.priceChange.min || crypto.price_change_percentage_24h >= Number(activeFilters.priceChange.min)) &&
                              (!activeFilters.priceChange.max || crypto.price_change_percentage_24h <= Number(activeFilters.priceChange.max));

      return meetsPrice && meetsMarketCap && meetsVolume && meetsPriceChange;
    });
  };

  const filteredCryptos = cryptos
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortOptions[sortBy]);

  const finalFilteredCryptos = applyAdvancedFilters(filteredCryptos);

  const filteredAndFavoritedCryptos = showOnlyFavorites
    ? finalFilteredCryptos.filter(crypto => favorites.includes(crypto.id))
    : finalFilteredCryptos;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto">
        <Header language={language} setLanguage={setLanguage} t={t} />
        <MarketStats />
        <MarketTrends language={language} />
        
        <div className="mb-8">
          <CryptoCalculator language={language} />
        </div>

        <div className="mb-8">
          <CryptoComparison language={language} />
        </div>

        <AdvancedFilters language={language} onApplyFilters={handleApplyFilters} />

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="glass-effect rounded-lg px-6 py-3 flex-1 md:w-96">
              <input
                type="text"
                placeholder={t.search}
                className="bg-transparent w-full focus:outline-none text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`p-3 rounded-lg transition-all duration-200 ${
                showOnlyFavorites 
                  ? 'bg-yellow-400/20 text-yellow-400' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-yellow-400'
              }`}
              title={language === 'pt' ? 'Mostrar favoritos' : 'Show favorites'}
            >
              <StarIcon filled={showOnlyFavorites} />
            </button>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              className="glass-effect rounded-lg px-6 py-3 bg-transparent text-white cursor-pointer flex-1 md:w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price">{t.price} (Maior → Menor)</option>
              <option value="price_asc">{t.price} (Menor → Maior)</option>
              <option value="market_cap">{t.marketCap}</option>
              <option value="change">{t.change}</option>
              <option value="volume">{t.volume}</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
                title={language === 'pt' ? 'Visualização em grade' : 'Grid view'}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
                title={language === 'pt' ? 'Visualização em tabela' : 'Table view'}
              >
                <TableIcon />
              </button>
            </div>
          </div>
        </div>

        <main>
          {loading ? (
            <div className="grid place-items-center h-64">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                <div className="absolute inset-3 rounded-full border-t-2 border-accent animate-spin" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-6 rounded-full border-t-2 border-accent animate-spin" />
              </div>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredAndFavoritedCryptos.map((crypto) => (
                <CryptoCard 
                  key={crypto.id} 
                  crypto={crypto} 
                  language={language}
                  isFavorite={favorites.includes(crypto.id)}
                  onToggleFavorite={() => toggleFavorite(crypto.id)}
                />
              ))}
            </div>
          ) : (
            <CryptoTable 
              cryptos={filteredAndFavoritedCryptos}
              language={language}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </main>
      </div>
    </div>
  );
}
