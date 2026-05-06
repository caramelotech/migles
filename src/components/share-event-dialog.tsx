import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Search, UserPlus, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchProfiles, inviteUserToEvent } from "@/services/events";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
  inviteCode: string | null;
  excludeUserIds: string[];
};

export function ShareEventDialog({
  open,
  onOpenChange,
  eventId,
  eventTitle,
  inviteCode,
  excludeUserIds,
}: Props) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

  const inviteUrl =
    typeof window !== "undefined"
      ? inviteCode
        ? `${window.location.origin}/i/${inviteCode}`
        : `${window.location.origin}/events/${eventId}`
      : "";

  const { data: results, isFetching } = useQuery({
    queryKey: ["profile-search", search, excludeUserIds],
    queryFn: () => searchProfiles(search, excludeUserIds),
    enabled: open && search.trim().length >= 2,
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Link copiado");
    } catch {
      toast.error("Não foi possível copiar");
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({ title: eventTitle, url: inviteUrl });
    } catch {
      // cancelled
    }
  }

  async function handleInvite(userId: string, name: string) {
    try {
      await inviteUserToEvent(eventId, userId);
      setInvitedIds((prev) => new Set(prev).add(userId));
      qc.invalidateQueries({ queryKey: ["event-rsvps", eventId] });
      toast.success(`${name} convidado(a)`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao convidar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar evento</DialogTitle>
          <DialogDescription>
            Convide pessoas pelo nome ou compartilhe o link e QR Code.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link & QR</TabsTrigger>
            <TabsTrigger value="users">Por usuário</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 pt-4">
            <div className="flex justify-center rounded-lg border border-border bg-card p-4">
              <QRCodeSVG value={inviteUrl} size={180} />
            </div>
            <div className="flex gap-2">
              <Input value={inviteUrl} readOnly className="text-xs" />
              <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button type="button" className="w-full" onClick={handleNativeShare}>
              Compartilhar
            </Button>
          </TabsContent>

          <TabsContent value="users" className="space-y-3 pt-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar pelo nome…"
                className="pl-8"
              />
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {search.trim().length < 2 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Digite ao menos 2 caracteres.
                </p>
              ) : isFetching ? (
                <p className="py-6 text-center text-xs text-muted-foreground">Buscando…</p>
              ) : (results?.length ?? 0) === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Nenhum usuário encontrado.
                </p>
              ) : (
                results!.map((p) => {
                  const invited = invitedIds.has(p.id);
                  const name = p.display_name ?? "—";
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50"
                    >
                      <Avatar className="h-8 w-8">
                        {p.avatar_url && <AvatarImage src={p.avatar_url} alt={name} />}
                        <AvatarFallback className="text-xs">
                          {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 truncate text-sm">{name}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant={invited ? "secondary" : "outline"}
                        disabled={invited}
                        onClick={() => handleInvite(p.id, name)}
                      >
                        {invited ? (
                          <>
                            <Check className="h-4 w-4" />
                            Convidado
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Convidar
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
