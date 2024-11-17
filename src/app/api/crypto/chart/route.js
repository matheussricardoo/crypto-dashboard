import { queueRequest } from '@/utils/apiUtils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const days = searchParams.get('days');
  const interval = searchParams.get('interval') || 'daily';

  if (!id) {
    return Response.json({ error: 'Missing coin id' }, { status: 400 });
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
    
    // Adiciona um timeout para a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 30 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        return Response.json({ 
          error: 'Rate limit exceeded',
          message: 'Muitas requisições, tente novamente em alguns segundos' 
        }, { status: 429 });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validação mais rigorosa dos dados
    if (!data) {
      throw new Error('No data received from CoinGecko');
    }

    if (!data.prices || !Array.isArray(data.prices)) {
      throw new Error('Invalid price data format');
    }

    if (data.prices.length === 0) {
      throw new Error('No price data available');
    }

    // Verifica se cada item do array tem o formato correto
    const isValidPriceData = data.prices.every(item => 
      Array.isArray(item) && 
      item.length === 2 && 
      typeof item[0] === 'number' && 
      typeof item[1] === 'number'
    );

    if (!isValidPriceData) {
      throw new Error('Invalid price data structure');
    }

    return Response.json({
      prices: data.prices,
      success: true
    });

  } catch (error) {
    console.error(`Error fetching chart data for ${id}:`, error);

    if (error.name === 'AbortError') {
      return Response.json({ 
        error: 'Request timeout',
        message: 'A requisição demorou muito para responder' 
      }, { status: 408 });
    }

    // Retorna uma mensagem de erro mais amigável
    return Response.json({ 
      error: 'Failed to fetch chart data',
      message: 'Dados temporariamente indisponíveis',
      details: error.message
    }, { status: 500 });
  }
} 