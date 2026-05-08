import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().min(1, "O nome é obrigatório"),
  bio: z.string().optional(),
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-z0-9_]+$/, "Apenas letras minúsculas, números e _")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
