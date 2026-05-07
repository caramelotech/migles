import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  location_type: z.enum(["in_person", "online"]),
  location: z.string().optional(),
  starts_at: z.string().min(1, "A data e hora são obrigatórias"),
  capacity: z.number().int().min(1, "A capacidade deve ser pelo menos 1").optional(),
  visibility: z.enum(["private", "community"]),
  community_id: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
