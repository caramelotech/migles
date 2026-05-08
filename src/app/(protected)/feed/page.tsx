"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Plus, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listMyEvents } from "@/services/events";
import { listMyCommunities } from "@/services/communities";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/page-spinner";
import { SectionHeading } from "@/components/section-heading";
import { EventCard } from "@/features/events/EventCard";
import { CommunityCard } from "@/features/communities/CommunityCard";

export default function FeedPage() {
  const { user } = useAuth();

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ["my-events", user?.id],
    queryFn: () => listMyEvents(user!.id),
    enabled: !!user,
  });

  const { data: memberships = [], isLoading: loadingCommunities } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => listMyCommunities(user!.id),
    enabled: !!user,
  });

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.starts_at) >= now).slice(0, 5);

  const communities = memberships.slice(0, 5);

  if (loadingEvents || loadingCommunities) return <PageSpinner />;

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="flex gap-3">
        <Button asChild className="flex-1">
          <Link href="/events/new">
            <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Novo evento
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href="/communities/new">
            <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Nova comunidade
          </Link>
        </Button>
      </div>

      {/* Upcoming events */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeading>Próximos eventos</SectionHeading>
          <Link
            href="/events"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium">Nenhum evento próximo</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Crie um evento ou aguarde um convite.
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="/events/new">
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                Criar evento
              </Link>
            </Button>
          </div>
        ) : (
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
        )}
      </section>

      {/* Communities */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeading>Suas comunidades</SectionHeading>
          <Link
            href="/communities"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todas
          </Link>
        </div>

        {communities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium">Nenhuma comunidade ainda</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Crie uma comunidade ou entre em uma existente.
              </p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href="/communities/new">
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                Criar comunidade
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {communities.map(({ community, role }) => (
              <CommunityCard
                key={community.id}
                community={community}
                role={role}
                href={`/communities/${community.id}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
