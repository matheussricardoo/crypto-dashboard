export async function GET() {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 