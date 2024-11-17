'use client';
import { useState, useEffect } from 'react';

export default function OrderBook({ symbol }) {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/binance/depth?symbol=${symbol}USDT`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados');
        }
        
        const data = await response.json();
        
        // Verifica se os dados são válidos
        if (data && Array.isArray(data.bids) && Array.isArray(data.asks)) {
          setOrderBook(data);
        } else {
          setError('Dados indisponíveis para este par');
        }
      } catch (error) {
        console.error('Erro ao buscar book de ofertas:', error);
        setError('Par não disponível na Binance');
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchOrderBook();
      const interval = setInterval(fetchOrderBook, 5000);
      return () => clearInterval(interval);
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="text-center py-4 text-zinc-400">
        <div className="animate-pulse">Carregando book de ofertas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-zinc-400 text-sm">
        {error}
      </div>
    );
  }

  // Verifica se há dados válidos antes de renderizar
  if (!orderBook.bids?.length || !orderBook.asks?.length) {
    return (
      <div className="text-center py-4 text-zinc-400 text-sm">
        Book de ofertas não disponível
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-white text-sm mb-3">Book de Ofertas</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="text-green-400 mb-2">Compras</h4>
          {orderBook.bids.slice(0, 5).map(([price, amount], i) => (
            <div key={i} className="flex justify-between text-green-400/80">
              <span>${parseFloat(price).toFixed(2)}</span>
              <span>{parseFloat(amount).toFixed(4)}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-red-400 mb-2">Vendas</h4>
          {orderBook.asks.slice(0, 5).map(([price, amount], i) => (
            <div key={i} className="flex justify-between text-red-400/80">
              <span>${parseFloat(price).toFixed(2)}</span>
              <span>{parseFloat(amount).toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 