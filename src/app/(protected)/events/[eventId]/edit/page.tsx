"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { getEvent, updateEvent, deleteEvent } from "@/services/events";
import { listMyCommunities } from "@/services/communities";
import { uploadCover } from "@/lib/upload-cover";
import { eventSchema, type EventFormValues } from "@/schemas/eventSchema";
import { Button } from "@/components/ui/button";
import { CoverUpload } from "@/components/cover-upload";
import { PageSpinner } from "@/components/page-spinner";
import { NotFound } from "@/components/not-found";
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

export default function EditEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const initialized = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
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

  const { data: event, isLoading: loadingEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => listMyCommunities(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (event && !initialized.current) {
      initialized.current = true;
      let starts_at_local = "";
      if (event.starts_at) {
        const d = new Date(event.starts_at);
        const pad = (n: number) => String(n).padStart(2, "0");
        starts_at_local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
      reset({
        title: event.title ?? "",
        description: event.description ?? "",
        location_type: (event.location_type as "in_person" | "online") ?? "in_person",
        location: event.location ?? "",
        starts_at: starts_at_local,
        capacity: event.capacity ?? undefined,
        visibility: (event.visibility as "private" | "community") ?? "private",
        community_id: event.community_id ?? undefined,
      });
      setCoverPreview(event.cover_url ?? null);
    }
  }, [event, reset]);

  const handleCoverSelect = useCallback((file: File, url: string) => {
    setCoverFile(file);
    setCoverPreview(url);
  }, []);

  const onSubmit = async (data: EventFormValues) => {
    if (!user) return;
    try {
      let cover_url: string | null | undefined = undefined;
      if (coverFile) {
        cover_url = await uploadCover(user.id, coverFile);
      }

      await updateEvent(eventId, {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        location: data.location_type === "in_person" ? data.location?.trim() || null : null,
        location_type: data.location_type,
        starts_at: new Date(data.starts_at).toISOString(),
        capacity: data.capacity ?? null,
        visibility: data.visibility,
        ...(cover_url !== undefined ? { cover_url } : {}),
      });

      toast.success("Evento atualizado!");
      router.push(`/events/${eventId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar evento.");
    }
  };

  async function handleDelete() {
    try {
      await deleteEvent(eventId);
      toast.success("Evento excluído.");
      queryClient.invalidateQueries({ queryKey: ["my-events", user?.id] });
      router.push("/events");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir evento.");
    }
  }

  if (loadingEvent) return <PageSpinner />;

  if (!event)
    return <NotFound message="Evento não encontrado." onBack={() => router.push("/events")} />;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        back={{ href: `/events/${eventId}`, label: "Voltar para o evento" }}
        title="Editar evento"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <Label htmlFor="location-type">Tipo de local</Label>
          <Controller
            control={control}
            name="location_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="location-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_person">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {locationType === "in_person" && (
          <div className="space-y-2">
            <Label htmlFor="location">Endereço / local</Label>
            <Input
              id="location"
              placeholder="Ex: Rua das Flores, 100 - São Paulo"
              autoComplete="street-address"
              {...register("location")}
            />
          </div>
        )}

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
          <Label htmlFor="visibility">Visibilidade</Label>
          <Controller
            control={control}
            name="visibility"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="community">Comunidade</SelectItem>
                </SelectContent>
              </Select>
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
            onClick={() => router.push(`/events/${eventId}`)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />}
            Salvar alterações
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Excluir evento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir evento?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação é permanente. Todos os RSVPs e comentários serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
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
