import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Wikipedia Search API URL
    // Prop: extracts (short text), pageimages (thumbnail)
    // Generator: search (to get search results)
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&generator=search&exsentences=2&exintro=1&explaintext=1&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10&piprop=thumbnail&pithumbsize=300&origin=*`;

    const response = await fetch(wikiUrl);
    const data = await response.json();

    if (!data.query || !data.query.pages) {
      return NextResponse.json({ results: [] });
    }

    const pages = data.query.pages;
    const results = Object.values(pages).map((page: any) => ({
      title: page.title,
      extract: page.extract || '',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
      thumbnail: page.thumbnail ? page.thumbnail.source : null,
      topic: page.title, // used for generating course
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Wikipedia Search Error:', error);
    return NextResponse.json({ results: [], error: 'Failed to fetch from Wikipedia' }, { status: 500 });
  }
}
