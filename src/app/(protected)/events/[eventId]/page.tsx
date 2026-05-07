"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Wifi,
  Users,
  Pencil,
  Share2,
  Send,
  Clock,
  Trash2,
  UserMinus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  getEvent,
  getEventOrganizerIds,
  getEventRsvps,
  listEventComments,
  setRsvp,
  addComment,
  deleteComment,
  removeRsvp,
  type RsvpStatus,
} from "@/services/events";
import { formatEventDate, formatRelativeDate } from "@/lib/format";
import { ShareEventDialog } from "@/components/share-event-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { PageSpinner } from "@/components/page-spinner";
import { NotFound } from "@/components/not-found";

export default function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const [shareOpen, setShareOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const { data: event, isLoading: loadingEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
  });

  const { data: organizerIds = [] } = useQuery({
    queryKey: ["event-organizers", eventId],
    queryFn: () => getEventOrganizerIds(eventId),
  });

  const { data: rsvps = [] } = useQuery({
    queryKey: ["event-rsvps", eventId],
    queryFn: () => getEventRsvps(eventId),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["event-comments", eventId],
    queryFn: () => listEventComments(eventId),
  });

  const isOrganizer = user ? organizerIds.includes(user.id) : false;

  const myRsvp = user
    ? (
        rsvps as Array<{ user_id: string; status: RsvpStatus; waitlist_position: number | null }>
      ).find((r) => r.user_id === user.id)
    : null;

  const confirmedRsvps = (
    rsvps as Array<{
      user_id: string;
      status: RsvpStatus;
      profiles: { display_name: string | null; avatar_url: string | null };
    }>
  ).filter((r) => r.status === "confirmed");

  async function handleRsvp(status: RsvpStatus) {
    if (!user) return;
    setRsvpLoading(true);
    try {
      await setRsvp(eventId, user.id, status);
      qc.invalidateQueries({ queryKey: ["event-rsvps", eventId] });
      qc.invalidateQueries({ queryKey: ["my-events", user.id] });
      const msgs: Record<RsvpStatus, string> = {
        confirmed: "Presença confirmada!",
        declined: "Presença recusada.",
        pending: "RSVP marcado como pendente.",
        waitlisted: "Você foi adicionado à lista de espera.",
      };
      toast.success(msgs[status]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar RSVP.");
    } finally {
      setRsvpLoading(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteComment(commentId);
      qc.invalidateQueries({ queryKey: ["event-comments", eventId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover comentário.");
    }
  }

  async function handleRemoveRsvp(userId: string) {
    try {
      await removeRsvp(eventId, userId);
      qc.invalidateQueries({ queryKey: ["event-rsvps", eventId] });
      qc.invalidateQueries({ queryKey: ["my-events", user?.id] });
      toast.success("RSVP removido.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover RSVP.");
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !comment.trim()) return;
    setPostingComment(true);
    try {
      await addComment(eventId, user.id, comment.trim());
      setComment("");
      qc.invalidateQueries({ queryKey: ["event-comments", eventId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao publicar comentário.");
    } finally {
      setPostingComment(false);
    }
  }

  if (loadingEvent) return <PageSpinner />;

  if (!event)
    return <NotFound message="Evento não encontrado." onBack={() => router.push("/events")} />;

  const isOnline = event.location_type === "online";
  const communityData = (event as unknown as { communities: { id: string; name: string } | null })
    .communities;

  const rsvpUserIds = (rsvps as Array<{ user_id: string }>).map((r) => r.user_id);

  return (
    <div className="space-y-6 w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {isOrganizer && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/events/${eventId}/edit`}>
                <Pencil className="h-4 w-4 mr-1" />
                Editar
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Cover */}
      {event.cover_url && (
        <div className="w-full h-52 rounded-xl overflow-hidden">
          <img src={event.cover_url} alt={event.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Title & meta */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight leading-snug">{event.title}</h1>

        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {formatEventDate(event.starts_at)}
            <Badge variant="outline" className="ml-1 text-xs">
              {formatRelativeDate(event.starts_at)}
            </Badge>
          </span>

          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 shrink-0" />
                Online
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 shrink-0" />
                {event.location || "Local a definir"}
              </>
            )}
          </span>

          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            {event.capacity && event.capacity > 0
              ? `${confirmedRsvps.length}/${event.capacity} confirmados`
              : `${confirmedRsvps.length} confirmados`}
          </span>
        </div>

        {event.description && (
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      <Separator />

      {/* RSVP */}
      <section className="space-y-3">
        <h2 className="font-semibold">Sua presença</h2>

        {myRsvp?.status === "waitlisted" && myRsvp.waitlist_position != null && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-600">
            <Clock className="h-4 w-4 shrink-0" />
            Você está na lista de espera - posição {myRsvp.waitlist_position}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={myRsvp?.status === "confirmed" ? "default" : "outline"}
            className={cn(
              "flex-1",
              myRsvp?.status === "confirmed" && "bg-emerald-600 hover:bg-emerald-700 text-white",
            )}
            onClick={() => handleRsvp("confirmed")}
            disabled={rsvpLoading}
          >
            Confirmar
          </Button>
          <Button
            variant={myRsvp?.status === "declined" ? "default" : "outline"}
            className={cn(
              "flex-1",
              myRsvp?.status === "declined" && "bg-red-600 hover:bg-red-700 text-white",
            )}
            onClick={() => handleRsvp("declined")}
            disabled={rsvpLoading}
          >
            Recusar
          </Button>
        </div>
      </section>

      <Separator />

      {/* Confirmed attendees */}
      {confirmedRsvps.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Confirmados ({confirmedRsvps.length})</h2>
          <div className="flex flex-wrap gap-3">
            {confirmedRsvps.map((r) => {
              const profile = (
                r as unknown as {
                  profiles: { display_name: string | null; avatar_url: string | null };
                }
              ).profiles;
              const name = profile?.display_name ?? "Usuário";
              return (
                <div key={r.user_id} className="flex flex-col items-center gap-1">
                  <UserAvatar name={name} avatarUrl={profile?.avatar_url} size="lg" />
                  <span className="text-xs text-muted-foreground max-w-[5rem] truncate text-center">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Separator />

      {/* Comments */}
      <section className="space-y-4">
        <h2 className="font-semibold">Comentários ({comments.length})</h2>

        {/* Comment list */}
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          )}
          {(
            comments as Array<{
              id: string;
              content: string;
              created_at: string;
              user_id: string;
              profiles: { display_name: string | null; avatar_url: string | null };
            }>
          ).map((c) => {
            const name = c.profiles?.display_name ?? "Usuário";
            const canDelete = user?.id === c.user_id || isOrganizer;
            return (
              <div key={c.id} className="flex gap-3 group">
                <UserAvatar
                  name={name}
                  avatarUrl={c.profiles?.avatar_url}
                  className="shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(c.created_at)}
                    </span>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        title="Remover comentário"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {c.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* New comment input */}
        {user && (
          <form onSubmit={handleComment} className="flex gap-2 items-end">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva um comentário..."
              rows={2}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleComment(e as unknown as React.FormEvent);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={postingComment || !comment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </section>

      {/* Organizer: manage all RSVPs */}
      {isOrganizer && rsvps.length > 0 && (
        <>
          <Separator />
          <section className="space-y-3">
            <h2 className="font-semibold">Gerenciar participantes</h2>
            {(
              [
                { label: "Confirmados", status: "confirmed" },
                { label: "Lista de espera", status: "waitlisted" },
                { label: "Pendentes", status: "pending" },
                { label: "Recusados", status: "declined" },
              ] as const
            ).map(({ label, status }) => {
              type RsvpWithProfile = {
                user_id: string;
                status: RsvpStatus;
                waitlist_position: number | null;
                profiles: { display_name: string | null; avatar_url: string | null } | null;
              };
              const group = (rsvps as unknown as RsvpWithProfile[]).filter(
                (r) => r.status === status,
              );
              if (group.length === 0) return null;
              return (
                <div key={status} className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {label} ({group.length})
                  </p>
                  {group.map((r) => {
                    const name = r.profiles?.display_name ?? "Usuário";
                    const avatarUrl = r.profiles?.avatar_url;
                    return (
                      <div
                        key={r.user_id}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/30 transition-colors"
                      >
                        <UserAvatar
                          name={name}
                          avatarUrl={avatarUrl}
                          size="sm"
                          className="shrink-0"
                        />
                        <span className="flex-1 text-sm truncate">{name}</span>
                        {r.status === "waitlisted" && r.waitlist_position != null && (
                          <span className="text-xs text-muted-foreground">
                            #{r.waitlist_position}
                          </span>
                        )}
                        {r.user_id !== user?.id && (
                          <button
                            onClick={() => handleRemoveRsvp(r.user_id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="Remover RSVP"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </section>
        </>
      )}

      {/* Share dialog */}
      <ShareEventDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        eventId={eventId}
        eventTitle={event.title}
        inviteCode={event.invite_code}
        excludeUserIds={rsvpUserIds}
      />
    </div>
  );
}
