"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Globe, Lock, Users } from "lucide-react";
import { getProfileByUsername } from "@/services/profiles";
import { listSharedCommunities } from "@/services/communities";
import { listUserEventsForProfile } from "@/services/events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/page-spinner";
import { EventCard } from "@/features/events/EventCard";
import { cn } from "@/lib/utils";
import { avatarColor } from "@/lib/formatters";
import { useAuth } from "@/lib/auth-context";

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-by-username", username],
    queryFn: () => getProfileByUsername(username),
  });

  const { data: sharedCommunities = [] } = useQuery({
    queryKey: ["shared-communities", user?.id, profile?.id],
    queryFn: () => listSharedCommunities(user!.id, profile!.id),
    enabled: !!user && !!profile && user.id !== profile.id,
  });

  const { data: userEvents = [] } = useQuery({
    queryKey: ["user-events-for-profile", profile?.id, user?.id],
    queryFn: () => listUserEventsForProfile(profile!.id, user!.id),
    enabled: !!user && !!profile && user.id !== profile.id,
  });

  if (isLoading) return <PageSpinner />;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="font-semibold">Usuário não encontrado</p>
        <p className="text-sm text-muted-foreground">@{username} não existe.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
          Voltar
        </Button>
      </div>
    );
  }

  const initial = (profile.display_name ?? profile.username ?? "?").charAt(0).toUpperCase();
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1.5 text-muted-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar
      </Button>

      <div className="flex flex-col items-center gap-4 pt-4">
        <div
          className={cn(
            "h-24 w-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white",
            !profile.avatar_url && avatarColor(profile.id),
          )}
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? username}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.display_name ?? `@${username}`}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">@{profile.username ?? username}</p>
        </div>

        {profile.bio && (
          <p className="text-sm text-center text-muted-foreground max-w-sm">{profile.bio}</p>
        )}
      </div>

      {!isOwnProfile && sharedCommunities.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            Comunidades em comum
          </h2>
          <div className="flex flex-col gap-1">
            {sharedCommunities.map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.id}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/30 transition-colors"
              >
                <Badge variant="outline" className="shrink-0 gap-1 text-xs">
                  {c.type === "public" ? (
                    <>
                      <Globe className="h-3 w-3" />
                      Pública
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      Privada
                    </>
                  )}
                </Badge>
                <span className="text-sm font-medium truncate">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!isOwnProfile && userEvents.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Eventos de {profile.display_name ?? `@${username}`}
          </h2>
          <div className="flex flex-col gap-2">
            {userEvents.map((event) => (
              <EventCard key={event.id} event={event} href={`/events/${event.id}`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
