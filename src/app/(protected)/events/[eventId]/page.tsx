"use client";

import { use, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  MapPin,
  MoreHorizontal,
  Shield,
  ShieldOff,
  Wifi,
  Users,
  User,
  Send,
  Clock,
  Trash2,
  UserMinus,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
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
  addEventOrganizer,
  removeEventOrganizer,
  type RsvpStatus,
} from "@/services/events";
import { formatEventDate, formatRelativeDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { PageSpinner } from "@/components/page-spinner";
import { NotFound } from "@/components/not-found";
import { DetailHero } from "@/components/detail-hero";
import { EditButton } from "@/components/edit-button";
import { ShareButton } from "@/components/share-button";

const ShareEventDialog = dynamic(
  () => import("@/components/share-event-dialog").then((m) => ({ default: m.ShareEventDialog })),
  { ssr: false },
);

const RSVP_STATUS_SECTIONS = [
  { label: "Confirmados", status: "confirmed" },
  { label: "Lista de espera", status: "waitlisted" },
  { label: "Pendentes", status: "pending" },
  { label: "Recusados", status: "declined" },
] as const;

export default function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const [shareOpen, setShareOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [participantsExpanded, setParticipantsExpanded] = useState(false);

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

  async function handleAddOrganizer(userId: string) {
    try {
      await addEventOrganizer(eventId, userId);
      qc.invalidateQueries({ queryKey: ["event-organizers", eventId] });
      toast.success("Organizador adicionado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar organizador.");
    }
  }

  async function handleRemoveOrganizer(userId: string) {
    try {
      await removeEventOrganizer(eventId, userId);
      qc.invalidateQueries({ queryKey: ["event-organizers", eventId] });
      toast.success("Organizador removido.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover organizador.");
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
  const creatorProfile = (event as unknown as { profiles: { display_name: string | null } | null })
    .profiles;

  const rsvpUserIds = (rsvps as Array<{ user_id: string }>).map((r) => r.user_id);

  return (
    <div className="space-y-6">
      <PageHeader back={{ href: "/events", label: "Voltar para eventos" }} title="Evento">
        {isOrganizer && <EditButton href={`/events/${eventId}/edit`} />}
        <ShareButton onClick={() => setShareOpen(true)} />
      </PageHeader>

      <DetailHero
        coverUrl={event.cover_url}
        coverAlt={event.title}
        title={event.title}
        description={event.description}
        meta={
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
                  {event.location ? (
                    <a
                      href={event.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {event.location}
                    </a>
                  ) : (
                    "Online"
                  )}
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
                : `${rsvps.length} ${rsvps.length === 1 ? "convidado" : "convidados"}`}
            </span>

            {communityData ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 shrink-0" />
                {communityData.name}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 shrink-0" />
                {creatorProfile?.display_name ?? "Usuário"}
              </span>
            )}
          </div>
        }
      />

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
      {(confirmedRsvps.length > 0 || (isOrganizer && rsvps.length > 0)) && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Convidados ({rsvps.length})</h2>
            <button
              onClick={() => setParticipantsExpanded((v) => !v)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={participantsExpanded}
            >
              {participantsExpanded ? "Recolher" : isOrganizer ? "Gerenciar" : "Ver todos"}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", participantsExpanded && "rotate-180")}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Collapsed: avatar grid */}
          {!participantsExpanded && confirmedRsvps.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {confirmedRsvps.map((r) => {
                const profile = (
                  r as unknown as {
                    profiles: { display_name: string | null; avatar_url: string | null };
                  }
                ).profiles;
                const name = profile?.display_name ?? "Usuário";
                const isMe = r.user_id === user?.id;
                return (
                  <div key={r.user_id} className="flex flex-col items-center gap-0.5">
                    <UserAvatar name={name} avatarUrl={profile?.avatar_url} size="lg" />
                    <span className="text-xs text-muted-foreground max-w-[5rem] truncate text-center">
                      {name}
                    </span>
                    {isMe && <span className="text-[10px] text-muted-foreground">(você)</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Expanded: full list by status with management actions for organizers */}
          {participantsExpanded && (
            <div className="space-y-4">
              {RSVP_STATUS_SECTIONS.map(({ label, status }) => {
                if (!isOrganizer && status !== "confirmed") return null;
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
                    <p className="text-xs text-muted-foreground font-medium">
                      {label} ({group.length})
                    </p>
                    {group.map((r) => {
                      const name = r.profiles?.display_name ?? "Usuário";
                      const isMe = r.user_id === user?.id;
                      const isThisOrganizer = organizerIds.includes(r.user_id);
                      const isCreator = r.user_id === event.created_by;
                      return (
                        <div
                          key={r.user_id}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/30 transition-colors"
                        >
                          <UserAvatar
                            name={name}
                            avatarUrl={r.profiles?.avatar_url}
                            size="sm"
                            className="shrink-0"
                          />
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <span className="text-sm truncate">{name}</span>
                            {isMe && (
                              <span className="text-xs text-muted-foreground shrink-0">(você)</span>
                            )}
                          </div>
                          {status === "waitlisted" && r.waitlist_position != null && (
                            <span className="text-xs text-muted-foreground">
                              #{r.waitlist_position}
                            </span>
                          )}
                          {isOrganizer && !isMe && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {isThisOrganizer ? (
                                  <DropdownMenuItem
                                    disabled={isCreator}
                                    onClick={() => !isCreator && handleRemoveOrganizer(r.user_id)}
                                  >
                                    <ShieldOff className="h-4 w-4 mr-2" />
                                    Remover de organizador
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleAddOrganizer(r.user_id)}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Tornar organizador
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleRemoveRsvp(r.user_id)}
                                >
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Remover do evento
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
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
                        aria-label="Remover comentário"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
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
              placeholder="Escreva um comentário…"
              rows={2}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleComment(e as unknown as React.FormEvent);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={postingComment || !comment.trim()}
              aria-label="Publicar comentário"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        )}
      </section>

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
