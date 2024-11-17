export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`);
    
    if (!response.ok) {
      // Se o par não existir na Binance, retorna um erro mais amigável
      if (response.status === 400) {
        return Response.json({ error: 'Par não disponível' }, { status: 404 });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verifica se os dados são válidos
    if (!data.bids || !data.asks) {
      return Response.json({ error: 'Dados inválidos' }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Erro na API Binance:', error);
    return Response.json(
      { error: 'Erro ao buscar dados do book de ofertas' }, 
      { status: 500 }
    );
  }
} 