import { z } from "zod";

export const communitySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  type: z.enum(["public", "private"]),
});

export type CommunityFormValues = z.infer<typeof communitySchema>;
