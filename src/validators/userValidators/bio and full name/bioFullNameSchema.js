import { z } from "zod";

export const bioFullNameSchema = z
  .object({
    fullName: z.string().min(3).max(50).optional(),

    bio: z.string().min(30).max(2000).optional()

  })
  .refine((data) => Object.keys(data).some((key) => data[key] !== undefined), {
    message: "At least one field must be provided to update.",
  });
