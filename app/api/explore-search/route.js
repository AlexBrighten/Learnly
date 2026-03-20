import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Wikipedia search API — completely free, no key needed
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=8&format=json&origin=*&srnamespace=0`;
    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "Learnly/1.0 (educational app)" },
    });
    const searchData = await searchRes.json();
    const hits = searchData?.query?.search || [];

    // Fetch summary for top results in parallel (up to 5)
    const top5 = hits.slice(0, 5);
    const summaries = await Promise.all(
      top5.map(async (hit) => {
        try {
          const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`;
          const sumRes = await fetch(summaryUrl, {
            headers: { "User-Agent": "Learnly/1.0 (educational app)" },
          });
          const sum = await sumRes.json();
          return {
            title: sum.title,
            description: sum.description || "",
            extract: sum.extract ? sum.extract.slice(0, 200) + "…" : "",
            thumbnail: sum.thumbnail?.source || null,
            url: sum.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`,
            topic: sum.title,
          };
        } catch {
          return {
            title: hit.title,
            description: "",
            extract: hit.snippet?.replace(/<[^>]*>/g, "").slice(0, 200) + "…" || "",
            thumbnail: null,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`,
            topic: hit.title,
          };
        }
      })
    );

    return NextResponse.json({ results: summaries });
  } catch (error) {
    console.error("Wikipedia search error:", error);
    return NextResponse.json({ error: "Search failed", results: [] }, { status: 500 });
  }
}
