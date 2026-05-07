"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Camera, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { getProfile, updateProfile } from "@/services/profiles";
import { uploadCover } from "@/lib/upload-cover";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/page-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function avatarInitial(name: string | null | undefined) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setAvatarPreview(profile.avatar_url ?? null);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Não autenticado.");
      let avatar_url: string | null | undefined = undefined;
      if (avatarFile) {
        avatar_url = await uploadCover(user.id, avatarFile);
      }
      return updateProfile(user.id, {
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || null,
        ...(avatar_url !== undefined ? { avatar_url } : {}),
      });
    },
    onSuccess: () => {
      toast.success("Perfil atualizado!");
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setAvatarFile(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar perfil.");
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate();
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "h-24 w-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white",
                !avatarPreview && "bg-primary",
              )}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                avatarInitial(displayName || profile?.display_name)
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors shadow-sm"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Alterar foto
          </button>
        </div>

        <Separator />

        {/* Info somente leitura */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            E-mail
          </p>
          <p className="text-sm">{user?.email ?? profile?.email ?? "-"}</p>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="display-name">Nome</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre você..."
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
