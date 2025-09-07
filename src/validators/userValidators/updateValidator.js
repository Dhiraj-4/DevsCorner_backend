import { z } from "zod";

export const updateSchema = z
  .object({
    fullName: z.string().min(3).max(50).optional(),

    bio: z.string().min(30).max(2000).optional(),

    socials: z
      .object({
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        twitter: z.string().url().optional(),
      }).optional(),

    location: z.string().min(2).max(100).optional(),
  })
  .refine((data) => Object.keys(data).some((key) => data[key] !== undefined), {
    message: "At least one field must be provided to update.",
  });
