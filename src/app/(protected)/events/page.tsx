"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Wifi, Plus, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listMyEvents, type EventWithCounts, type RsvpStatus } from "@/services/events";
import { formatEventDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function rsvpBadge(status: RsvpStatus | null) {
  if (status === "confirmed")
    return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20">Confirmado</Badge>;
  if (status === "pending")
    return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/20">Pendente</Badge>;
  if (status === "declined")
    return <Badge className="bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/20">Recusado</Badge>;
  if (status === "waitlisted")
    return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Lista de espera</Badge>;
  return <Badge variant="outline">Participar</Badge>;
}

function EventCard({ event, onClick }: { event: EventWithCounts; onClick: () => void }) {
  const isOnline = event.location_type === "online";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors p-4 flex gap-4"
    >
      {event.cover_url && (
        <img
          src={event.cover_url}
          alt={event.title}
          className="h-16 w-16 rounded-lg object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-snug truncate">{event.title}</p>
          {rsvpBadge(event.my_rsvp)}
        </div>

        <div className="mt-1.5 flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {formatEventDate(event.starts_at)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 shrink-0" />
                Online
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{event.location || "Local a definir"}</span>
              </>
            )}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 shrink-0" />
            {event.capacity && event.capacity > 0
              ? `${event.confirmed_count}/${event.capacity} confirmados`
              : `${event.confirmed_count} confirmados`}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["my-events", user?.id],
    queryFn: () => listMyEvents(user!.id),
    enabled: !!user,
  });

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.starts_at) >= now);
  const past = events.filter((e) => new Date(e.starts_at) < now);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Eventos</h1>
        <Button size="sm" onClick={() => router.push("/events/new")}>
          <Plus className="h-4 w-4 mr-1" />
          Criar
        </Button>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">Nenhum evento ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie seu primeiro evento ou aguarde um convite.
            </p>
          </div>
          <Button onClick={() => router.push("/events/new")}>
            <Plus className="h-4 w-4 mr-1" />
            Criar evento
          </Button>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Próximos
          </h2>
          <div className="flex flex-col gap-2">
            {upcoming.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => router.push(`/events/${event.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Passados
          </h2>
          <div className={cn("flex flex-col gap-2", upcoming.length > 0 && "opacity-60")}>
            {past.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => router.push(`/events/${event.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
