"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Search, UserPlus, Check, Link2 } from "lucide-react";
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
import { UserAvatar } from "@/components/user-avatar";
import { joinCommunity } from "@/services/communities";
import { searchProfiles } from "@/services/profiles";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  communityName: string;
  isAdmin: boolean;
  memberIds: string[];
};

export function InviteCommunityDialog({
  open,
  onOpenChange,
  communityId,
  communityName,
  isAdmin,
  memberIds,
}: Props) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/communities/${communityId}` : "";

  const { data: results, isFetching } = useQuery({
    queryKey: ["profile-search", search, memberIds],
    queryFn: () => searchProfiles(search, memberIds),
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
      await navigator.share({ title: communityName, url: inviteUrl });
    } catch {
      // cancelled
    }
  }

  async function handleAdd(userId: string, name: string) {
    try {
      await joinCommunity(communityId, userId);
      setAddedIds((prev) => new Set(prev).add(userId));
      qc.invalidateQueries({ queryKey: ["community-members", communityId] });
      toast.success(`${name} adicionado(a) à comunidade`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar membro");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar membros</DialogTitle>
          <DialogDescription>
            Compartilhe o link da comunidade ou adicione usuários diretamente.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link de convite</TabsTrigger>
            <TabsTrigger value="users" disabled={!isAdmin}>
              Por usuário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-3 pt-4">
            <div className="flex gap-2">
              <Input value={inviteUrl} readOnly className="text-xs" />
              <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button type="button" className="w-full" onClick={handleNativeShare}>
              <Link2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </TabsContent>

          <TabsContent value="users" className="space-y-3 pt-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar pelo nome ou e-mail…"
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
                  const added = addedIds.has(p.id);
                  const name = p.display_name ?? "—";
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50"
                    >
                      <UserAvatar name={name} avatarUrl={p.avatar_url} />
                      <span className="flex-1 truncate text-sm">{name}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant={added ? "secondary" : "outline"}
                        disabled={added}
                        onClick={() => handleAdd(p.id, name)}
                      >
                        {added ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Adicionado
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Adicionar
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
