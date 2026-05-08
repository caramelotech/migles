"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Search, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listMyEvents } from "@/services/events";
import { listMyCommunities } from "@/services/communities";
import { Input } from "@/components/ui/input";
import { PageSpinner } from "@/components/page-spinner";
import { EventCard } from "@/features/events/EventCard";
import { CommunityCard } from "@/features/communities/CommunityCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FeedPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"events" | "communities">("events");
  const [query, setQuery] = useState("");

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
  const q = query.trim().toLowerCase();

  const filteredEvents = events
    .filter((e) => new Date(e.starts_at) >= now)
    .filter((e) => !q || e.title.toLowerCase().includes(q));

  const filteredCommunities = memberships.filter(
    ({ community }) => !q || community.name.toLowerCase().includes(q),
  );

  function handleTabChange(value: string) {
    setTab(value as "events" | "communities");
    setQuery("");
  }

  if (loadingEvents || loadingCommunities) return <PageSpinner />;

  const placeholder = tab === "events" ? "Buscar eventos…" : "Buscar comunidades…";

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="flex items-center gap-3">
          <TabsList>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="communities">Comunidades</TabsTrigger>
          </TabsList>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>

        {/* Events tab */}
        <TabsContent value="events" className="mt-4 space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <CalendarDays className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {q ? "Nenhum evento encontrado" : "Nenhum evento próximo"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {q ? `Nenhum resultado para "${query}"` : "Crie um evento ou aguarde um convite."}
                </p>
              </div>
            </div>
          ) : (
            filteredEvents.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                href={`/events/${event.id}`}
                priority={i === 0}
              />
            ))
          )}
        </TabsContent>

        {/* Communities tab */}
        <TabsContent value="communities" className="mt-4 space-y-2">
          {filteredCommunities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {q ? "Nenhuma comunidade encontrada" : "Nenhuma comunidade ainda"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {q
                    ? `Nenhum resultado para "${query}"`
                    : "Crie uma comunidade ou entre em uma existente."}
                </p>
              </div>
            </div>
          ) : (
            filteredCommunities.map(({ community, role }) => (
              <CommunityCard
                key={community.id}
                community={community}
                role={role as "admin" | "member"}
                href={`/communities/${community.id}`}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
