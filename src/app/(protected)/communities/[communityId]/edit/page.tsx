"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Loader2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { getCommunity, updateCommunity, type CommunityType } from "@/services/communities";
import { uploadCover } from "@/lib/upload-cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function EditCommunityPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CommunityType>("public");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: community, isLoading } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
  });

  useEffect(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description ?? "");
      setType(community.type as CommunityType);
      setCoverPreview(community.cover_url ?? null);
    }
  }, [community]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Não autenticado.");
      let cover_url: string | null | undefined = undefined;
      if (coverFile) {
        cover_url = await uploadCover(user.id, coverFile);
      }
      return updateCommunity(communityId, {
        name: name.trim(),
        description: description.trim() || null,
        type,
        ...(cover_url !== undefined ? { cover_url } : {}),
      });
    },
    onSuccess: (updated) => {
      toast.success("Comunidade atualizada!");
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      queryClient.invalidateQueries({ queryKey: ["my-communities", user?.id] });
      router.push(`/communities/${updated.id}`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar comunidade.");
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }
    updateMutation.mutate();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="font-semibold">Comunidade não encontrada.</p>
        <Button variant="outline" onClick={() => router.push("/communities")}>
          Voltar
        </Button>
      </div>
    );
  }

  if (user?.id !== community.created_by) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="font-semibold">Sem permissão</p>
        <p className="text-sm text-muted-foreground">
          Somente o criador da comunidade pode editá-la.
        </p>
        <Button variant="outline" onClick={() => router.push(`/communities/${communityId}`)}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/communities/${communityId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Editar comunidade</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cover */}
        <div className="space-y-2">
          <Label>Capa da comunidade</Label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-36 rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden"
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Preview da capa"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Clique para alterar a capa</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da comunidade"
            required
          />
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Do que se trata essa comunidade?"
            rows={3}
          />
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label>Tipo</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("public")}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-colors",
                type === "public"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80 hover:bg-muted/30",
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Globe className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Pública</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Qualquer pessoa pode encontrar e entrar na comunidade.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setType("private")}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-colors",
                type === "private"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80 hover:bg-muted/30",
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Lock className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Privada</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Somente membros convidados podem participar.
              </p>
            </button>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/communities/${communityId}`)}
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
