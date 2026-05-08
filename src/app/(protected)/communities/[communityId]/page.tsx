"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Globe,
  Lock,
  UserPlus,
  Loader2,
  MoreHorizontal,
  Shield,
  ShieldOff,
  UserMinus,
  Ban,
  LogOut,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EditButton } from "@/components/edit-button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  getCommunity,
  listMyCommunities,
  listCommunityMembers,
  joinCommunity,
  updateMemberRole,
  banMember,
  removeMember,
  type CommunityMemberRole,
} from "@/services/communities";
import { listCommunityEvents } from "@/services/events";
import { EventCard } from "@/features/events/EventCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserAvatar } from "@/components/user-avatar";
import { PageSpinner } from "@/components/page-spinner";
import { NotFound } from "@/components/not-found";
import { InviteCommunityDialog } from "@/components/invite-community-dialog";
import { DetailHero } from "@/components/detail-hero";

type PendingAction = { type: "remove" | "ban" | "leave"; userId: string; name: string };

export default function CommunityPage({ params }: { params: Promise<{ communityId: string }> }) {
  const { communityId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: community, isLoading: loadingCommunity } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ["community-events", communityId, user?.id],
    queryFn: () => listCommunityEvents(communityId, user?.id),
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => listMyCommunities(user!.id),
    enabled: !!user,
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["community-members", communityId],
    queryFn: () => listCommunityMembers(communityId),
    enabled: !!communityId,
  });

  const membership = memberships.find((m) => m.community.id === communityId);
  const isMember = !!membership;
  const isAdmin = membership?.role === "admin";

  function invalidateMembers() {
    queryClient.invalidateQueries({ queryKey: ["community-members", communityId] });
    queryClient.invalidateQueries({ queryKey: ["my-communities", user?.id] });
  }

  const joinMutation = useMutation({
    mutationFn: () => joinCommunity(communityId, user!.id),
    onSuccess: () => {
      toast.success("Você entrou na comunidade!");
      invalidateMembers();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erro ao entrar."),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: CommunityMemberRole }) =>
      updateMemberRole(communityId, userId, role),
    onSuccess: () => {
      toast.success("Papel atualizado.");
      invalidateMembers();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erro ao atualizar papel."),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeMember(communityId, userId),
    onSuccess: (_, userId) => {
      if (userId === user?.id) {
        toast.success("Você saiu da comunidade.");
        queryClient.invalidateQueries({ queryKey: ["my-communities", user?.id] });
        router.push("/communities");
      } else {
        toast.success("Membro removido.");
        invalidateMembers();
      }
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erro ao remover membro."),
  });

  const banMutation = useMutation({
    mutationFn: (userId: string) => banMember(communityId, userId),
    onSuccess: () => {
      toast.success("Membro banido.");
      invalidateMembers();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erro ao banir membro."),
  });

  function confirmAction() {
    if (!pendingAction) return;
    if (pendingAction.type === "ban") banMutation.mutate(pendingAction.userId);
    else removeMutation.mutate(pendingAction.userId);
    setPendingAction(null);
  }

  if (loadingCommunity) return <PageSpinner />;

  if (!community)
    return (
      <NotFound message="Comunidade não encontrada." onBack={() => router.push("/communities")} />
    );

  return (
    <div className="space-y-6">
      <PageHeader back={{ href: "/communities", label: "Comunidades" }} title="Comunidade">
        {isAdmin ? (
          <EditButton href={`/communities/${communityId}/edit`} />
        ) : isMember ? (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setPendingAction({ type: "leave", userId: user!.id, name: "você" })}
          >
            <LogOut className="h-4 w-4 mr-1" aria-hidden="true" />
            Sair
          </Button>
        ) : (
          <Button size="sm" onClick={() => joinMutation.mutate()} disabled={joinMutation.isPending}>
            {joinMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden="true" />
            ) : (
              <UserPlus className="h-4 w-4 mr-1" aria-hidden="true" />
            )}
            Entrar
          </Button>
        )}
      </PageHeader>

      <DetailHero
        coverUrl={community.cover_url}
        coverAlt={community.name}
        showCoverFallback
        title={community.name}
        badge={
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
        }
        description={community.description}
        meta={
          isMember && !loadingMembers ? (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              {members.length} {members.length === 1 ? "membro" : "membros"}
            </span>
          ) : undefined
        }
      />

      <Tabs defaultValue="eventos">
        <TabsList className="w-full">
          <TabsTrigger value="eventos" className="flex-1 gap-1.5">
            <CalendarDays className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="membros" className="flex-1 gap-1.5">
            <Users className="h-4 w-4" />
            Membros{!loadingMembers && isMember ? ` (${members.length})` : ""}
          </TabsTrigger>
        </TabsList>

        {/* Events tab */}
        <TabsContent value="eventos" className="mt-4">
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
                <EventCard key={event.id} event={event} href={`/events/${event.id}`} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Members tab */}
        <TabsContent value="membros" className="mt-4">
          {!isMember ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Users className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Entre na comunidade para ver os membros.
              </p>
            </div>
          ) : loadingMembers ? (
            <div className="flex justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  {members.length} {members.length === 1 ? "membro" : "membros"}
                </span>
                <Button size="sm" variant="outline" onClick={() => setInviteOpen(true)}>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Convidar
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                {members.map((m) => {
                  const name = m.profiles?.display_name ?? "Usuário";
                  const isCurrentUser = m.user_id === user?.id;
                  const isThisAdmin = m.role === "admin";
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/30 transition-colors"
                    >
                      <UserAvatar
                        name={name}
                        avatarUrl={m.profiles?.avatar_url}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">
                          {name}
                          {isCurrentUser && (
                            <span className="ml-1.5 text-xs text-muted-foreground">(você)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={isThisAdmin ? "default" : "outline"} className="text-xs">
                          {isThisAdmin ? "Admin" : "Membro"}
                        </Badge>

                        {isAdmin && !isCurrentUser && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {isThisAdmin ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    roleMutation.mutate({ userId: m.user_id, role: "member" })
                                  }
                                >
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  Remover de admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    roleMutation.mutate({ userId: m.user_id, role: "admin" })
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Tornar admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  setPendingAction({ type: "remove", userId: m.user_id, name })
                                }
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remover da comunidade
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  setPendingAction({ type: "ban", userId: m.user_id, name })
                                }
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Banir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <InviteCommunityDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        communityId={communityId}
        communityName={community.name}
        isAdmin={isAdmin}
        memberIds={members.map((m) => m.user_id)}
      />

      {/* Confirmation dialog */}
      <AlertDialog open={!!pendingAction} onOpenChange={(o) => !o && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.type === "ban"
                ? `Banir ${pendingAction.name}?`
                : pendingAction?.type === "leave"
                  ? "Sair da comunidade?"
                  : `Remover ${pendingAction?.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === "ban"
                ? "Essa ação é permanente. O usuário não poderá reingressar por nenhum mecanismo."
                : pendingAction?.type === "leave"
                  ? "Você perderá acesso à comunidade e seus eventos. Para voltar, precisará entrar novamente."
                  : "O usuário será removido da comunidade e perderá acesso aos eventos."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                pendingAction?.type === "ban"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {pendingAction?.type === "ban"
                ? "Banir"
                : pendingAction?.type === "leave"
                  ? "Sair"
                  : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
