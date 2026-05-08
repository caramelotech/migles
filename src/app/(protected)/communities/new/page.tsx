"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2, Lock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { createCommunity } from "@/services/communities";
import { uploadCover } from "@/lib/upload-cover";
import { communitySchema, type CommunityFormValues } from "@/schemas/communitySchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CoverUpload } from "@/components/cover-upload";

export default function NewCommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: "",
      description: "",
      type: "public",
    },
  });

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const type = watch("type");

  const handleCoverSelect = useCallback((file: File, url: string) => {
    setCoverFile(file);
    setCoverPreview(url);
  }, []);

  const onSubmit = async (data: CommunityFormValues) => {
    if (!user) return;
    try {
      let cover_url: string | null = null;
      if (coverFile) {
        cover_url = await uploadCover(user.id, coverFile);
      }

      const community = await createCommunity({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        type: data.type,
        cover_url,
        created_by: user.id,
      });

      toast.success("Comunidade criada!");
      router.push(`/communities/${community.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar comunidade.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        back={{ href: "/communities", label: "Voltar para comunidades" }}
        title="Nova comunidade"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <CoverUpload
          preview={coverPreview}
          onFileSelect={handleCoverSelect}
          label="Capa da comunidade"
          height="h-36"
        />

        <div className="space-y-2">
          <Label htmlFor="name">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nome da comunidade"
            autoComplete="off"
            spellCheck={false}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Do que se trata essa comunidade?"
            rows={3}
            {...register("description")}
          />
        </div>

        <div className="space-y-2">
          <Label id="type-label">Tipo</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div
                className="grid grid-cols-2 gap-3"
                role="radiogroup"
                aria-labelledby="type-label"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={field.value === "public"}
                  onClick={() => field.onChange("public")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors",
                    field.value === "public"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-semibold text-sm">Pública</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Qualquer pessoa pode encontrar e entrar na comunidade.
                  </p>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={field.value === "private"}
                  onClick={() => field.onChange("private")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors",
                    field.value === "private"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-semibold text-sm">Privada</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Somente membros convidados podem participar.
                  </p>
                </button>
              </div>
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/communities")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />}
            Criar comunidade
          </Button>
        </div>
      </form>
    </div>
  );
}
