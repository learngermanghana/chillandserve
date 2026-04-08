import { YouTubeVideo } from "./types";

const YOUTUBE_REVALIDATE_SECONDS = 60 * 60;

function decodeXmlEntities(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function readTagContent(source: string, tagName: string): string | undefined {
  const match = source.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`));
  if (!match?.[1]) return undefined;
  return decodeXmlEntities(match[1].trim());
}

export async function getLatestYouTubeVideos(channelId?: string, maxVideos = 4): Promise<YouTubeVideo[]> {
  if (!channelId) return [];

  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      method: "GET",
      next: { revalidate: YOUTUBE_REVALIDATE_SECONDS }
    });

    if (!response.ok) return [];

    const feed = await response.text();
    const entries = [...feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);

    return entries
      .map((entry): YouTubeVideo | null => {
        const id = readTagContent(entry, "yt:videoId");
        const title = readTagContent(entry, "title");
        const publishedAt = readTagContent(entry, "published");

        if (!id || !title) return null;

        return {
          id,
          title,
          publishedAt,
          url: `https://www.youtube.com/watch?v=${id}`
        };
      })
      .filter((video): video is YouTubeVideo => Boolean(video))
      .slice(0, Math.max(maxVideos, 1));
  } catch {
    return [];
  }
}
