"use client";

import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

interface PublicNavbarProps {
  showLogin?: boolean;
}

export function PublicNavbar({ showLogin = true }: PublicNavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between h-20">
      <Link href="/" className="text-2xl font-bold">
        Migles
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        {showLogin && (
          <Button asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
