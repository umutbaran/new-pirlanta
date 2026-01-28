import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.RAPIDAPI_URL;
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST;

  console.log("API Config Check:", { url: !!url, apiKey: !!apiKey, apiHost: !!apiHost });

  if (!url || !apiKey || !apiHost) {
    return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.error(`API External Error: ${response.status} ${response.statusText}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // DEBUG: Gelen veriyi terminale yazdır (Structure check)
    console.log("HAREM API RESPONSE SAMPLE:", JSON.stringify(data).substring(0, 500) + "..."); 

    return NextResponse.json(data);

  } catch (error) {
    console.error('Gold Rate Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}