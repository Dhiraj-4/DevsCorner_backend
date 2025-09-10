import { z } from "zod";

export const updateSchema = z
  .object({
    fullName: z.string().min(3).max(50).optional(),

    bio: z.string().min(30).max(2000).optional(),

    email: z.string().email().optional(),

    location: z.string().min(2).max(100).optional(),

    resume: z.string().optional(),

    skills: z.array(z.string()).optional().nullable(),

    socials: z
    .object({
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
    })
    .optional(),

  })
  .refine((data) => Object.keys(data).some((key) => data[key] !== undefined), {
    message: "At least one field must be provided to update.",
  });
