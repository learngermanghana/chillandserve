import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./section-heading";
import { YouTubeVideo } from "@/lib/types";

interface LatestVideosColumnProps {
  videos: YouTubeVideo[];
  channelId?: string;
}

function formatPublishedDate(date?: string): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}

export default function LatestVideosColumn({ videos, channelId }: LatestVideosColumnProps) {
  if (!videos.length) return null;

  return (
    <section id="latest-videos" className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="On YouTube"
          title="Latest Videos"
          description="Fresh clips from Chill and Serve Ghana's YouTube channel, automatically updated from the promo integration."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {videos[0] ? (
            <Link
              href={videos[0].url}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-3xl border border-charcoalBrand/10 bg-ivoryBrand shadow-premium"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={`https://i.ytimg.com/vi/${videos[0].id}/hqdefault.jpg`}
                  alt={videos[0].title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emeraldBrand">Featured Upload</p>
                <h3 className="text-2xl font-semibold text-charcoalBrand">{videos[0].title}</h3>
                {videos[0].publishedAt ? (
                  <p className="text-sm text-charcoalBrand/70">Published {formatPublishedDate(videos[0].publishedAt)}</p>
                ) : null}
              </div>
            </Link>
          ) : null}

          <div className="space-y-4">
            {videos.slice(1).map((video) => (
              <Link
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="group flex gap-4 rounded-2xl border border-charcoalBrand/10 bg-white p-3 transition hover:border-emeraldBrand/30 hover:shadow-premium"
              >
                <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-xl">
                  <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} fill className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p className="line-clamp-2 text-sm font-medium text-charcoalBrand">{video.title}</p>
                  {video.publishedAt ? (
                    <p className="mt-1 text-xs text-charcoalBrand/60">{formatPublishedDate(video.publishedAt)}</p>
                  ) : null}
                </div>
              </Link>
            ))}

            {channelId ? (
              <Link
                href={`https://www.youtube.com/channel/${channelId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-goldBrand/60 px-5 py-2 text-sm font-medium text-charcoalBrand transition hover:bg-goldBrand/20"
              >
                View all videos
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
