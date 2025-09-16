import { z } from "zod";

export const locationSchema = z.object({
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(100, "Location too long (max 100 chars)"),
});