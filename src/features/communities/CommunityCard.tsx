import Link from "next/link";
import Image from "next/image";
import { Globe, Lock } from "lucide-react";
import { type CommunityRow } from "@/services/communities";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { avatarColor } from "@/lib/formatters";

export function CommunityCard({
  community,
  role,
  href,
}: {
  community: CommunityRow;
  role?: "admin" | "member";
  href: string;
}) {
  const initial = community.name.charAt(0).toUpperCase();

  return (
    <Link
      href={href}
      className="touch-manipulation w-full rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors p-4 flex items-center gap-4"
    >
      <div
        className={cn(
          "h-11 w-11 shrink-0 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold text-lg",
          !community.cover_url && avatarColor(community.id),
        )}
      >
        {community.cover_url ? (
          <Image
            src={community.cover_url}
            alt={community.name}
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm leading-snug truncate">{community.name}</p>
          {role && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs shrink-0",
                role === "admin" ? "border-primary/40 text-primary" : "text-muted-foreground",
              )}
            >
              {role === "admin" ? "Admin" : "Membro"}
            </Badge>
          )}
        </div>
        {community.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
            {community.description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {community.type === "public" ? (
            <>
              <Globe className="h-3 w-3" aria-hidden="true" />
              Pública
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" aria-hidden="true" />
              Privada
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
