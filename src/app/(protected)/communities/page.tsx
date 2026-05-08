"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth-context";
import { listMyCommunities, searchPublicCommunities } from "@/services/communities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageSpinner } from "@/components/page-spinner";
import { SectionHeading } from "@/components/section-heading";
import { CommunityCard } from "@/features/communities/CommunityCard";

function CommunitiesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

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

  function handleQueryChange(value: string) {
    setQuery(value);
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.replace(`/communities${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  if (loadingMine) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader title="Comunidades">
        <Button size="sm" asChild>
          <Link href="/communities/new">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            Nova
          </Link>
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Buscar comunidades…"
          className="pl-9"
        />
      </div>

      {/* Minhas comunidades */}
      <section className="space-y-3">
        <SectionHeading>Minhas comunidades</SectionHeading>

        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Users className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold">Você ainda não participa de nenhuma comunidade</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie uma nova ou busque comunidades para entrar.
              </p>
            </div>
            <Button asChild>
              <Link href="/communities/new">
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                Criar comunidade
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {memberships.map(({ role, community }) => (
              <CommunityCard
                key={community.id}
                community={community}
                role={role as "admin" | "member"}
                href={`/communities/${community.id}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Descobrir - só aparece quando buscando */}
      {searchEnabled && (
        <section className="space-y-3">
          <SectionHeading>Descobrir</SectionHeading>

          {loadingSearch ? (
            <div role="status" className="flex justify-center py-8">
              <div
                className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"
                aria-hidden="true"
              />
              <span className="sr-only">Carregando…</span>
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
                  href={`/communities/${community.id}`}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function CommunitiesPage() {
  return (
    <Suspense>
      <CommunitiesContent />
    </Suspense>
  );
}
