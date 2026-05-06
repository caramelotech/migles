"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Users, Lock, Globe } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  listMyCommunities,
  searchPublicCommunities,
  type CommunityRow,
} from "@/services/communities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function avatarColor(id: string) {
  const palette = [
    "bg-primary",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-orange-500",
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function CommunityCard({
  community,
  role,
  onClick,
}: {
  community: CommunityRow;
  role?: "admin" | "member";
  onClick: () => void;
}) {
  const initial = community.name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors p-4 flex items-center gap-4"
    >
      <div
        className={cn(
          "h-11 w-11 shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-lg",
          avatarColor(community.id),
        )}
      >
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm leading-snug truncate">{community.name}</p>
          {role && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs shrink-0",
                role === "admin"
                  ? "border-primary/40 text-primary"
                  : "text-muted-foreground",
              )}
            >
              {role === "admin" ? "Admin" : "Membro"}
            </Badge>
          )}
        </div>
        {community.description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
            {community.description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
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
        </div>
      </div>
    </button>
  );
}

export default function CommunitiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { data: memberships = [], isLoading: loadingMine } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => listMyCommunities(user!.id),
    enabled: !!user,
  });

  const searchEnabled = query.trim().length >= 2;

  const { data: publicResults = [], isLoading: loadingSearch } = useQuery({
    queryKey: ["public-communities", query],
    queryFn: () => searchPublicCommunities(query),
    enabled: searchEnabled,
  });

  const myIds = new Set(memberships.map((m) => m.community.id));
  const discoveryResults = publicResults.filter((c) => !myIds.has(c.id));

  if (loadingMine) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Comunidades</h1>
        <Button size="sm" onClick={() => router.push("/communities/new")}>
          <Plus className="h-4 w-4 mr-1" />
          Nova
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar comunidades..."
          className="pl-9"
        />
      </div>

      {/* Minhas comunidades */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Minhas comunidades
        </h2>

        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Você ainda não participa de nenhuma comunidade</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie uma nova ou busque comunidades para entrar.
              </p>
            </div>
            <Button onClick={() => router.push("/communities/new")}>
              <Plus className="h-4 w-4 mr-1" />
              Criar comunidade
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {memberships.map(({ role, community }) => (
              <CommunityCard
                key={community.id}
                community={community}
                role={role as "admin" | "member"}
                onClick={() => router.push(`/communities/${community.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Descobrir - só aparece quando buscando */}
      {searchEnabled && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Descobrir
          </h2>

          {loadingSearch ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : discoveryResults.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhuma comunidade pública encontrada para &quot;{query}&quot;.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {discoveryResults.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onClick={() => router.push(`/communities/${community.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
