'use client';
import { useState, useEffect } from 'react';

export default function Header({ language, setLanguage, t }) {
  const [time, setTime] = useState('');
  const [btcPrice, setBtcPrice] = useState(null);

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now);
    };

    setTime(formatTime());

    const timer = setInterval(() => {
      setTime(formatTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch('/api/crypto');
        const data = await response.json();
        const btc = data.find(coin => coin.id === 'bitcoin');
        setBtcPrice(btc?.current_price);
      } catch (error) {
        console.error('Erro ao buscar preço do BTC:', error);
      }
    };

    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="flex flex-col gap-6 mb-12">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {t.title}
          </h1>
          <p className="text-zinc-400 mt-2">
            {currentDate} - {time}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('pt')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                language === 'pt' ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                language === 'en' ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              EN
            </button>
          </div>
          {btcPrice && (
            <div className="text-sm text-zinc-400">
              BTC: ${btcPrice.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 