"use client";

import { use, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Globe, Lock, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  getCommunity,
  updateCommunity,
  deleteCommunity,
  type CommunityType,
} from "@/services/communities";
import { uploadCover } from "@/lib/upload-cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CoverUpload } from "@/components/cover-upload";
import { PageSpinner } from "@/components/page-spinner";
import { NotFound } from "@/components/not-found";

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
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<CommunityType>("public");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const initialized = useRef(false);

  const { data: community, isLoading } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
  });

  useEffect(() => {
    if (community && !initialized.current) {
      initialized.current = true;
      setName(community.name);
      setDescription(community.description ?? "");
      setSlug(community.slug ?? "");
      setType(community.type as CommunityType);
      setCoverPreview(community.cover_url ?? null);
    }
  }, [community]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteCommunity(communityId),
    onSuccess: () => {
      toast.success("Comunidade excluída.");
      queryClient.invalidateQueries({ queryKey: ["my-communities", user?.id] });
      router.push("/communities");
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Erro ao excluir comunidade."),
  });

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
        slug: slug.trim() || null,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }
    updateMutation.mutate();
  }

  if (isLoading) return <PageSpinner />;

  if (!community)
    return (
      <NotFound message="Comunidade não encontrada." onBack={() => router.push("/communities")} />
    );

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
    <div className="space-y-6 w-full">
      <PageHeader
        back={{ href: `/communities/${communityId}`, label: "Voltar para a comunidade" }}
        title="Editar comunidade"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <CoverUpload
          preview={coverPreview}
          onFileSelect={(file, url) => {
            setCoverFile(file);
            setCoverPreview(url);
          }}
          label="Capa da comunidade"
          height="h-36"
        />

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

        {/* Identificador */}
        <div className="space-y-2">
          <Label htmlFor="slug">Identificador</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
              @
            </span>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="minha-comunidade"
              autoComplete="off"
              spellCheck={false}
              className="pl-7"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Letras minúsculas, números e - · 3 a 50 caracteres
          </p>
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

        {/* Excluir */}
        <div className="pt-4 border-t border-border">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir comunidade
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir "{community.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação é permanente e não pode ser desfeita. Todos os membros perderão acesso.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate()}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  );
}
