'use client';
import { useState, useEffect } from 'react';

export default function CryptoCalculator({ language }) {
  const [amount, setAmount] = useState('1');
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('USD');
  const [result, setResult] = useState(null);
  const [brlResult, setBrlResult] = useState(null);
  const [cryptoList, setCryptoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    BRL: 5,
    EUR: 0.85,
    GBP: 0.73,
  });

  // Lista de moedas fiduciárias
  const fiatCurrencies = {
    USD: { name: 'US Dollar', symbol: '$' },
    BRL: { name: 'Real Brasileiro', symbol: 'R$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
  };

  // Buscar taxas de câmbio
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data.rates) {
          setExchangeRates({
            USD: 1,
            BRL: data.rates.BRL,
            EUR: data.rates.EUR,
            GBP: data.rates.GBP,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar taxas de câmbio:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Buscar lista de criptomoedas
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const cached = localStorage.getItem('cryptoCalculatorData');
        const cachedTimestamp = localStorage.getItem('cryptoCalculatorTimestamp');
        const now = Date.now();

        if (cached && cachedTimestamp && now - parseInt(cachedTimestamp) < 30000) {
          setCryptoList(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const response = await fetch('/api/crypto');
        const data = await response.json();
        
        localStorage.setItem('cryptoCalculatorData', JSON.stringify(data));
        localStorage.setItem('cryptoCalculatorTimestamp', now.toString());
        
        setCryptoList(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar criptomoedas:', error);
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const calculateConversion = () => {
    let fromValue, toValue;

    // Calcula valor base em USD
    if (Object.keys(fiatCurrencies).includes(fromCrypto)) {
      fromValue = 1 / exchangeRates[fromCrypto];
    } else {
      const fromCoin = cryptoList.find(c => c.symbol.toUpperCase() === fromCrypto.toUpperCase());
      fromValue = fromCoin?.current_price || 0;
    }

    // Calcula valor de destino
    if (Object.keys(fiatCurrencies).includes(toCrypto)) {
      toValue = exchangeRates[toCrypto];
    } else {
      const toCoin = cryptoList.find(c => c.symbol.toUpperCase() === toCrypto.toUpperCase());
      toValue = 1 / (toCoin?.current_price || 1);
    }

    const convertedAmount = parseFloat(amount) * fromValue / toValue;
    setResult(convertedAmount);

    // Calcula o valor em BRL para referência
    const brlAmount = convertedAmount * (toCrypto === 'BRL' ? 1 : exchangeRates.BRL);
    setBrlResult(brlAmount);
  };

  return (
    <div className="glass-effect rounded-lg p-6">
      <h3 className="text-white text-lg mb-6">
        {language === 'pt' ? 'Calculadora' : 'Calculator'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-zinc-400 text-sm mb-2">
            {language === 'pt' ? 'Quantidade' : 'Amount'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">
              {language === 'pt' ? 'De' : 'From'}
            </label>
            <select
              value={fromCrypto}
              onChange={(e) => setFromCrypto(e.target.value)}
              className="w-full bg-white/5 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
            >
              <optgroup label={language === 'pt' ? 'Moedas Fiduciárias' : 'Fiat Currencies'}>
                {Object.entries(fiatCurrencies).map(([code, { name }]) => (
                  <option key={code} value={code}>
                    {code} - {name}
                  </option>
                ))}
              </optgroup>
              <optgroup label={language === 'pt' ? 'Criptomoedas' : 'Cryptocurrencies'}>
                {!loading && cryptoList.map((crypto) => (
                  <option key={crypto.id} value={crypto.symbol.toUpperCase()}>
                    {crypto.symbol.toUpperCase()} - {crypto.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">
              {language === 'pt' ? 'Para' : 'To'}
            </label>
            <select
              value={toCrypto}
              onChange={(e) => setToCrypto(e.target.value)}
              className="w-full bg-white/5 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
            >
              <optgroup label={language === 'pt' ? 'Moedas Fiduciárias' : 'Fiat Currencies'}>
                {Object.entries(fiatCurrencies).map(([code, { name }]) => (
                  <option key={code} value={code}>
                    {code} - {name}
                  </option>
                ))}
              </optgroup>
              <optgroup label={language === 'pt' ? 'Criptomoedas' : 'Cryptocurrencies'}>
                {!loading && cryptoList.map((crypto) => (
                  <option key={crypto.id} value={crypto.symbol.toUpperCase()}>
                    {crypto.symbol.toUpperCase()} - {crypto.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <button
          onClick={calculateConversion}
          disabled={loading}
          className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 transition-colors disabled:opacity-50"
        >
          {language === 'pt' ? 'Calcular' : 'Calculate'}
        </button>

        {result !== null && (
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-zinc-400 text-sm mb-1">
                {language === 'pt' ? 'Resultado' : 'Result'}
              </p>
              <p className="text-2xl text-white font-bold">
                {fiatCurrencies[toCrypto]?.symbol || ''}{result.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}
                {!fiatCurrencies[toCrypto] && ` ${toCrypto}`}
              </p>
            </div>

            {toCrypto !== 'BRL' && (
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-zinc-400 text-sm mb-1">
                  {language === 'pt' ? 'Valor em BRL' : 'Value in BRL'}
                </p>
                <p className="text-2xl text-white font-bold">
                  R${brlResult.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  })}
                </p>
              </div>
            )}

            <div className="text-xs text-zinc-500 mt-2">
              {language === 'pt' ? 'Taxas de câmbio atualizadas' : 'Updated exchange rates'}:
              <br />
              USD: $1.00 | EUR: €{exchangeRates.EUR.toFixed(2)} | GBP: £{exchangeRates.GBP.toFixed(2)} | BRL: R${exchangeRates.BRL.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 