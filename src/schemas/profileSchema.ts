import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().min(1, "O nome é obrigatório"),
  bio: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
