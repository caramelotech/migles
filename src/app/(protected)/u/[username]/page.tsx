"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProfileByUsername } from "@/services/profiles";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/page-spinner";
import { cn } from "@/lib/utils";
import { avatarColor } from "@/lib/formatters";

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-by-username", username],
    queryFn: () => getProfileByUsername(username),
  });

  if (isLoading) return <PageSpinner />;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="font-semibold">Usuário não encontrado</p>
        <p className="text-sm text-muted-foreground">@{username} não existe.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
          Voltar
        </Button>
      </div>
    );
  }

  const initial = (profile.display_name ?? profile.username ?? "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1.5 text-muted-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar
      </Button>

      <div className="flex flex-col items-center gap-4 pt-4">
        {/* Avatar */}
        <div
          className={cn(
            "h-24 w-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white",
            !profile.avatar_url && avatarColor(profile.id),
          )}
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? username}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </div>

        {/* Name + handle */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.display_name ?? `@${username}`}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">@{profile.username ?? username}</p>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-center text-muted-foreground max-w-sm">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}
