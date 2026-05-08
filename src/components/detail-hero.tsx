import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DetailHeroProps {
  coverUrl?: string | null;
  /** Used as image alt text and as the fallback initial letter */
  coverAlt: string;
  /**
   * When true, always renders the cover area — showing the image if available,
   * or a gradient placeholder with the first letter of coverAlt otherwise.
   * When false (default), the cover area is omitted entirely if coverUrl is absent.
   */
  showCoverFallback?: boolean;
  title: string;
  /** Badge or tag shown inline with the title */
  badge?: ReactNode;
  description?: string | null;
  /** Free-form meta content (dates, location, member count, etc.) */
  meta?: ReactNode;
  className?: string;
}

export function DetailHero({
  coverUrl,
  coverAlt,
  showCoverFallback = false,
  title,
  badge,
  description,
  meta,
  className,
}: DetailHeroProps) {
  const hasCover = !!coverUrl;
  const showCover = hasCover || showCoverFallback;

  return (
    <div className={cn("space-y-3", className)}>
      {showCover &&
        (hasCover ? (
          <div className="relative w-full h-52 rounded-xl overflow-hidden">
            <Image
              src={coverUrl!}
              alt={coverAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-52 rounded-xl overflow-hidden bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/30">
              {coverAlt.charAt(0).toUpperCase()}
            </span>
          </div>
        ))}

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight leading-snug">{title}</h1>
          {badge}
        </div>
        {meta}
        {description && (
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
