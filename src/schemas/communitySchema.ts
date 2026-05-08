import { z } from "zod";

export const communitySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  type: z.enum(["public", "private"]),
  slug: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e -")
    .optional()
    .or(z.literal("")),
});

export type CommunityFormValues = z.infer<typeof communitySchema>;
