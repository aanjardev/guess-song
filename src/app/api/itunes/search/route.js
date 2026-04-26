export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");
  const entity = searchParams.get("entity") || "musicArtist";
  const limit = searchParams.get("limit") || "10";

  if (!term) {
    return Response.json(
      { error: "Term parameter is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=${limit}&country=id`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from iTunes API");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("iTunes API error:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
