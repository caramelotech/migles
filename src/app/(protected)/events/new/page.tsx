"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, MapPin, Monitor, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { createEvent } from "@/services/events";
import { listMyCommunities } from "@/services/communities";
import { uploadCover } from "@/lib/upload-cover";
import { eventSchema, type EventFormValues } from "@/schemas/eventSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoverUpload } from "@/components/cover-upload";

export default function NewEventPage() {
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
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location_type: "in_person",
      location: "",
      starts_at: "",
      capacity: undefined,
      visibility: "private",
      community_id: undefined,
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

  const locationType = watch("location_type");
  const visibility = watch("visibility");

  const { data: memberships = [] } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => listMyCommunities(user!.id),
    enabled: !!user,
  });

  const handleCoverSelect = useCallback((file: File, url: string) => {
    setCoverFile(file);
    setCoverPreview(url);
  }, []);

  const onError = (errs: FieldErrors<EventFormValues>) => {
    const first = Object.values(errs)[0] as { message?: string } | undefined;
    toast.error(first?.message ?? "Corrija os erros no formulário antes de continuar.");
  };

  const onSubmit = async (data: EventFormValues) => {
    if (!user) return;
    try {
      let cover_url: string | null = null;
      if (coverFile) {
        cover_url = await uploadCover(user.id, coverFile);
      }

      const event = await createEvent({
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        location: data.location?.trim() || undefined,
        location_type: data.location_type,
        cover_url,
        starts_at: new Date(data.starts_at).toISOString(),
        capacity: data.capacity ?? null,
        visibility: data.visibility,
        community_id:
          data.visibility === "community" && data.community_id ? data.community_id : null,
        created_by: user.id,
      });

      toast.success("Evento criado!");
      router.push(`/events/${event.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar evento.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader back={{ href: "/events", label: "Voltar para eventos" }} title="Novo evento" />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        <CoverUpload
          preview={coverPreview}
          onFileSelect={handleCoverSelect}
          label="Capa do evento"
        />

        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Nome do evento"
            autoComplete="off"
            spellCheck={false}
            {...register("title")}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Fale um pouco sobre o evento…"
            rows={4}
            {...register("description")}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de local</Label>
          <Controller
            control={control}
            name="location_type"
            render={({ field }) => (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange("in_person")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${field.value === "in_person" ? "border-primary bg-primary/10 text-primary" : "border-input bg-transparent text-muted-foreground hover:bg-accent"}`}
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">Presencial</span>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("online")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${field.value === "online" ? "border-primary bg-primary/10 text-primary" : "border-input bg-transparent text-muted-foreground hover:bg-accent"}`}
                >
                  <Monitor className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">Online</span>
                </button>
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            {locationType === "in_person" ? "Endereço / local" : "Link do evento"}
          </Label>
          <Input
            id="location"
            placeholder={
              locationType === "in_person"
                ? "Ex: Rua das Flores, 100 - São Paulo"
                : "Ex: https://meet.google.com/abc-defg"
            }
            autoComplete={locationType === "in_person" ? "street-address" : "url"}
            {...register("location")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="starts-at">
            Data e hora <span className="text-destructive">*</span>
          </Label>
          <Input id="starts-at" type="datetime-local" {...register("starts_at")} />
          {errors.starts_at && (
            <p className="text-xs text-destructive">{errors.starts_at.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacidade (opcional)</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            placeholder="Ilimitado"
            {...register("capacity", {
              setValueAs: (v: string) => (v === "" ? undefined : Number.parseInt(v, 10)),
            })}
          />
          {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Visibilidade</Label>
          <Controller
            control={control}
            name="visibility"
            render={({ field }) => (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange("private")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${field.value === "private" ? "border-primary bg-primary/10 text-primary" : "border-input bg-transparent text-muted-foreground hover:bg-accent"}`}
                >
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">Privado</span>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("community")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors ${field.value === "community" ? "border-primary bg-primary/10 text-primary" : "border-input bg-transparent text-muted-foreground hover:bg-accent"}`}
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">Comunidade</span>
                </button>
              </div>
            )}
          />
        </div>

        {visibility === "community" && (
          <div className="space-y-2">
            <Label htmlFor="community">Comunidade</Label>
            <Controller
              control={control}
              name="community_id"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger id="community">
                    <SelectValue placeholder="Selecione uma comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberships.map(({ community }) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/events")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />}
            Criar evento
          </Button>
        </div>
      </form>
    </div>
  );
}
