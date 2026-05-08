"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, CalendarDays, Plus, User, Sun, Moon, LogOut, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listMyCommunities } from "@/services/communities";
import type { ReactNode } from "react";

const navItems = [
  { href: "/feed", label: "Início", icon: Home },
  { href: "/events", label: "Eventos", icon: CalendarDays },
  { href: "/profile", label: "Perfil", icon: User },
] as const;

function dotColor(id: string) {
  const palette = [
    "bg-primary",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-amber-500",
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

const navItemClass = (active: boolean) =>
  `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full ${
    active
      ? "bg-accent text-primary"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
  }`;

function CreateMenu({ side = "right" }: { side?: "right" | "top" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={navItemClass(false)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Criar
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="start" className="w-44">
        <DropdownMenuItem asChild>
          <Link href="/events/new" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Evento
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/communities/new" className="flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            Comunidade
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CreateMenuMobile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Criar
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="center" className="w-44 mb-1">
        <DropdownMenuItem asChild>
          <Link href="/events/new" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Evento
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/communities/new" className="flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            Comunidade
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { data: memberships = [] } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => (user ? listMyCommunities(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed";
    if (href === "/events") {
      return (
        pathname === "/events" || (pathname.startsWith("/events/") && pathname !== "/events/new")
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 border-r border-border flex-col sticky top-0 h-screen">
        <Link
          href="/feed"
          className="px-4 h-14 flex items-center gap-2 font-semibold tracking-tight hover:opacity-80"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            M
          </span>
          migles
        </Link>

        <nav className="px-2 py-2 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className={navItemClass(active)}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
          <CreateMenu side="right" />
        </nav>

        <div className="mt-4 px-4">
          <Link
            href="/communities"
            className="text-xs font-medium tracking-wider text-muted-foreground uppercase hover:text-foreground transition-colors"
          >
            Comunidades
          </Link>
        </div>
        <div className="mt-2 px-2 flex-1 overflow-y-auto">
          {memberships.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              Você ainda não participa de nenhuma.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {memberships.map(({ community }) => {
                const active = pathname === `/communities/${community.id}`;
                return (
                  <li key={community.id}>
                    <Link
                      href={`/communities/${community.id}`}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors w-full ${
                        active
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${dotColor(community.id)}`} />
                      <span className="truncate">{community.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-border flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex-1 justify-start"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
            {theme === "dark" ? "Tema claro" : "Tema escuro"}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => signOut()} aria-label="Sair">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6 md:py-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
          <CreateMenuMobile />
          <button
            type="button"
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground"
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-primary" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
            Tema
          </button>
        </div>
      </nav>
    </div>
  );
}
