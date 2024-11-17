'use client';
import { useState, useEffect } from 'react';

export default function CryptoComparison({ language }) {
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [availableCoins, setAvailableCoins] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('/api/crypto');
        const data = await response.json();
        setAvailableCoins(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar moedas:', error);
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const addCoin = (coinId) => {
    if (selectedCoins.length < 3) {
      const coin = availableCoins.find(c => c.id === coinId);
      if (coin) {
        setSelectedCoins([...selectedCoins, coin]);
      }
    }
  };

  const removeCoin = (coinId) => {
    setSelectedCoins(selectedCoins.filter(coin => coin.id !== coinId));
  };

  const calculateComparison = () => {
    if (selectedCoins.length < 2) return;

    const data = {
      priceComparison: selectedCoins.map(coin => ({
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
      })),
      marketCapRatio: selectedCoins.map(coin => ({
        name: coin.name,
        marketCap: coin.market_cap,
        percentage: (coin.market_cap / selectedCoins[0].market_cap * 100).toFixed(2)
      })),
      volumeComparison: selectedCoins.map(coin => ({
        name: coin.name,
        volume: coin.total_volume,
        volumeToMarketCap: (coin.total_volume / coin.market_cap * 100).toFixed(2)
      }))
    };

    setComparisonData(data);
  };

  return (
    <div className="glass-effect rounded-lg p-6">
      <h3 className="text-white text-lg mb-6">
        {language === 'pt' ? 'Comparação de Criptomoedas' : 'Cryptocurrency Comparison'}
      </h3>

      <div className="space-y-6">
        {/* Seleção de moedas */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">
            {language === 'pt' ? 'Selecione até 3 moedas' : 'Select up to 3 coins'}
          </label>
          <select
            className="w-full bg-white/5 rounded-lg p-3 text-white focus:outline-none"
            onChange={(e) => addCoin(e.target.value)}
            value=""
          >
            <option value="">
              {language === 'pt' ? 'Escolha uma moeda' : 'Choose a coin'}
            </option>
            {availableCoins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>

        {/* Moedas selecionadas */}
        <div className="flex flex-wrap gap-2">
          {selectedCoins.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1"
            >
              <img src={coin.image} alt={coin.name} className="w-4 h-4" />
              <span className="text-white text-sm">{coin.name}</span>
              <button
                onClick={() => removeCoin(coin.id)}
                className="text-zinc-400 hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {selectedCoins.length >= 2 && (
          <button
            onClick={calculateComparison}
            className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 transition-colors"
          >
            {language === 'pt' ? 'Comparar' : 'Compare'}
          </button>
        )}

        {/* Resultados da comparação */}
        {comparisonData && (
          <div className="space-y-6">
            {/* Comparação de preços */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white text-sm mb-3">
                {language === 'pt' ? 'Preços e Variação' : 'Prices and Change'}
              </h4>
              {comparisonData.priceComparison.map((coin) => (
                <div key={coin.name} className="flex justify-between mb-2">
                  <span className="text-zinc-400">{coin.name}</span>
                  <div className="text-right">
                    <span className="text-white">${coin.price.toLocaleString()}</span>
                    <span className={`ml-2 text-sm ${
                      coin.change24h > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparação de Market Cap */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white text-sm mb-3">
                {language === 'pt' ? 'Proporção de Market Cap' : 'Market Cap Ratio'}
              </h4>
              {comparisonData.marketCapRatio.map((coin) => (
                <div key={coin.name} className="flex justify-between mb-2">
                  <span className="text-zinc-400">{coin.name}</span>
                  <div className="text-right">
                    <span className="text-white">${(coin.marketCap / 1e9).toFixed(2)}B</span>
                    <span className="ml-2 text-sm text-zinc-400">
                      {coin.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparação de Volume */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white text-sm mb-3">
                {language === 'pt' ? 'Volume de Negociação' : 'Trading Volume'}
              </h4>
              {comparisonData.volumeComparison.map((coin) => (
                <div key={coin.name} className="flex justify-between mb-2">
                  <span className="text-zinc-400">{coin.name}</span>
                  <div className="text-right">
                    <span className="text-white">${(coin.volume / 1e9).toFixed(2)}B</span>
                    <span className="ml-2 text-sm text-zinc-400">
                      {coin.volumeToMarketCap}% MC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 