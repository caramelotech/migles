"use client";

import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera, LogOut } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { getProfile, updateProfile } from "@/services/profiles";
import { uploadCover } from "@/lib/upload-cover";
import { profileSchema, type ProfileFormValues } from "@/schemas/profileSchema";
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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { display_name: "", bio: "" },
  });

  const displayName = watch("display_name");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (profile && !initialized.current) {
      initialized.current = true;
      reset({
        display_name: profile.display_name ?? "",
        bio: profile.bio ?? "",
      });
      setAvatarPreview(profile.avatar_url ?? null);
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (!user) throw new Error("Não autenticado.");
      let avatar_url: string | null | undefined = undefined;
      if (avatarFile) {
        avatar_url = await uploadCover(user.id, avatarFile);
      }
      return updateProfile(user.id, {
        display_name: data.display_name.trim() || undefined,
        bio: data.bio?.trim() || null,
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

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader title="Perfil">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
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
              aria-label="Alterar foto de perfil"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors shadow-sm"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
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

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            E-mail
          </p>
          <p className="text-sm">{user?.email ?? profile?.email ?? "-"}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display-name">Nome</Label>
          <Input
            id="display-name"
            placeholder="Seu nome"
            autoComplete="name"
            {...register("display_name")}
          />
          {errors.display_name && (
            <p className="text-xs text-destructive">{errors.display_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Conte um pouco sobre você…"
            rows={3}
            {...register("bio")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
          {updateMutation.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
          )}
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
