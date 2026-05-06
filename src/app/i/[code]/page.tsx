"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ArrowRight, LinkIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getEventByInviteCode } from "@/services/events";
import { formatEventDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(`/i/${code}`)}`);
    }
  }, [user, authLoading, code, router]);

  const { data: event, isLoading } = useQuery({
    queryKey: ["invite", code],
    queryFn: () => getEventByInviteCode(code),
    enabled: !!user,
  });

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        {event ? (
          <>
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <LinkIcon className="h-7 w-7 text-primary" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Você foi convidado para</p>
              <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
            </div>

            {event.starts_at && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>{formatEventDate(event.starts_at)}</span>
              </div>
            )}

            {event.cover_url && (
              <img
                src={event.cover_url}
                alt={event.title}
                className="w-full rounded-xl object-cover h-44"
              />
            )}

            <Button className="w-full gap-2" onClick={() => router.push(`/events/${event.id}`)}>
              Ver evento
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <LinkIcon className="h-7 w-7 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold">Convite inválido ou expirado</h1>
              <p className="text-sm text-muted-foreground">
                Este link de convite não corresponde a nenhum evento ativo.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={() => router.push("/events")}>
              Ir para eventos
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
