"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Globe, Lock, Pencil, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  getCommunity,
  listMyCommunities,
  joinCommunity,
} from "@/services/communities";
import { listCommunityEvents } from "@/services/events";
import { formatEventDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CommunityPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: community, isLoading: loadingCommunity } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ["community-events", communityId],
    queryFn: () => listCommunityEvents(communityId),
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => listMyCommunities(user!.id),
    enabled: !!user,
  });

  const membership = memberships.find((m) => m.community.id === communityId);
  const isMember = !!membership;
  const isAdmin = membership?.role === "admin";

  const joinMutation = useMutation({
    mutationFn: () => joinCommunity(communityId, user!.id),
    onSuccess: () => {
      toast.success("Você entrou na comunidade!");
      queryClient.invalidateQueries({ queryKey: ["my-communities", user?.id] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao entrar na comunidade.");
    },
  });

  if (loadingCommunity) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="font-semibold">Comunidade não encontrada.</p>
        <Button variant="outline" onClick={() => router.push("/communities")}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 -ml-2"
        onClick={() => router.push("/communities")}
      >
        <ArrowLeft className="h-4 w-4" />
        Comunidades
      </Button>

      {/* Cover / Header */}
      <div className="rounded-xl overflow-hidden border border-border bg-card">
        {community.cover_url ? (
          <img
            src={community.cover_url}
            alt={community.name}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-5xl font-bold text-primary/40">
              {community.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold leading-tight">{community.name}</h1>
                <Badge variant="outline" className="shrink-0 gap-1">
                  {community.type === "public" ? (
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
              </div>
              {community.description && (
                <p className="mt-1.5 text-sm text-muted-foreground">{community.description}</p>
              )}
            </div>

            <div className="shrink-0">
              {isAdmin ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/communities/${communityId}/edit`)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Editar
                </Button>
              ) : !isMember ? (
                <Button
                  size="sm"
                  onClick={() => joinMutation.mutate()}
                  disabled={joinMutation.isPending}
                >
                  {joinMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Entrar
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Eventos */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Eventos
        </h2>

        {loadingEvents ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum evento nesta comunidade ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => router.push(`/events/${event.id}`)}
                className="w-full text-left rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors p-4 flex items-center gap-4"
              >
                {event.cover_url && (
                  <img
                    src={event.cover_url}
                    alt={event.title}
                    className="h-12 w-12 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{event.title}</p>
                  <span className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    {formatEventDate(event.starts_at)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
