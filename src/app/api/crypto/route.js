export async function GET(request) {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&locale=en',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }, // Revalidate every 30 seconds
      }
    );

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 