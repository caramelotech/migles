"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Loader2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { createCommunity, type CommunityType } from "@/services/communities";
import { uploadCover } from "@/lib/upload-cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function NewCommunityPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CommunityType>("public");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }

    setSubmitting(true);
    try {
      let cover_url: string | null = null;
      if (coverFile) {
        cover_url = await uploadCover(user.id, coverFile);
      }

      const community = await createCommunity({
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        cover_url,
        created_by: user.id,
      });

      toast.success("Comunidade criada!");
      router.push(`/communities/${community.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar comunidade.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/communities")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Nova comunidade</h1>
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
                <span className="text-sm text-muted-foreground">Clique para adicionar capa</span>
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
            onClick={() => router.push("/communities")}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Criar comunidade
          </Button>
        </div>
      </form>
    </div>
  );
}
