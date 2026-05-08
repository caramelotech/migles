import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Wifi, Users } from "lucide-react";
import { type EventWithCounts, type RsvpStatus } from "@/services/events";
import { formatEventDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

function rsvpBadge(status: RsvpStatus | null) {
  if (status === "confirmed")
    return (
      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20">
        Confirmado
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/20">
        Pendente
      </Badge>
    );
  if (status === "declined")
    return (
      <Badge className="bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/20">
        Recusado
      </Badge>
    );
  if (status === "waitlisted")
    return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Lista de espera</Badge>;
  return <Badge variant="outline">Participar</Badge>;
}

export function EventCard({ event, href }: { event: EventWithCounts; href: string }) {
  const isOnline = event.location_type === "online";

  return (
    <Link
      href={href}
      className="touch-manipulation w-full rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors overflow-hidden flex flex-col"
    >
      {event.cover_url && (
        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={event.cover_url}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-base leading-snug">{event.title}</p>
          {rsvpBadge(event.my_rsvp)}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {formatEventDate(event.starts_at)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{event.location || "Online"}</span>
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{event.location || "Local a definir"}</span>
              </>
            )}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {event.capacity && event.capacity > 0
              ? `${event.confirmed_count}/${event.capacity} confirmados`
              : `${event.confirmed_count} confirmados`}
          </span>
        </div>
      </div>
    </Link>
  );
}
