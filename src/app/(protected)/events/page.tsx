"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listMyEvents } from "@/services/events";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageSpinner } from "@/components/page-spinner";
import { SectionHeading } from "@/components/section-heading";
import { EventCard } from "@/features/events/EventCard";
import { PageHeader } from "@/components/page-header";

export default function EventsPage() {
  const { user } = useAuth();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["my-events", user?.id],
    queryFn: () => listMyEvents(user!.id),
    enabled: !!user,
  });

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.starts_at) >= now);
  const past = events.filter((e) => new Date(e.starts_at) < now);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader title="Eventos">
        <Button size="sm" asChild>
          <Link href="/events/new">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            Criar
          </Link>
        </Button>
      </PageHeader>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <CalendarDays className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Nenhum evento ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie seu primeiro evento ou aguarde um convite.
            </p>
          </div>
          <Button asChild>
            <Link href="/events/new">
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              Criar evento
            </Link>
          </Button>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <SectionHeading>Próximos</SectionHeading>
          <div className="flex flex-col gap-2">
            {upcoming.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                href={`/events/${event.id}`}
                priority={i === 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className="space-y-3">
          <SectionHeading>Passados</SectionHeading>
          <div className={cn("flex flex-col gap-2", upcoming.length > 0 && "opacity-60")}>
            {past.map((event) => (
              <EventCard key={event.id} event={event} href={`/events/${event.id}`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
