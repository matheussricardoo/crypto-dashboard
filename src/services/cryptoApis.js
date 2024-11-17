const APIs = {
  // CoinGecko
  coingecko: {
    markets: '/api/crypto',
    chart: (id, days) => `/api/crypto/chart?id=${id}&days=${days}`,
  },
  
  // Binance
  binance: {
    ticker: '/api/binance/ticker',
    depth: (symbol) => `/api/binance/depth?symbol=${symbol}`,
  },
  
  // Fear & Greed Index
  fearGreed: '/api/fear-greed',
};

export default APIs; 