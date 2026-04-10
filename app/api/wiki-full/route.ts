import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');

  if (!title) {
    return NextResponse.json({ extract: '' });
  }

  try {
    // Wikipedia Search API URL for full extract (plain text)
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext=1&titles=${encodeURIComponent(title)}&origin=*`;

    const response = await fetch(wikiUrl);
    const data = await response.json();

    if (!data.query || !data.query.pages) {
      return NextResponse.json({ extract: '' });
    }

    const pages = data.query.pages;
    const extract = (Object.values(pages)[0] as any)?.extract || '';

    return NextResponse.json({ extract });
  } catch (error) {
    console.error('Wikipedia Full Detail Error:', error);
    return NextResponse.json({ extract: '', error: 'Failed to fetch full detail from Wikipedia' }, { status: 500 });
  }
}
