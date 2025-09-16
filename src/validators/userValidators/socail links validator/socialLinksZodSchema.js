import { z } from "zod";

export const socialLinksSchema = z.object({
  github: z
    .string()
    .url()
    .regex(
      /^https:\/\/(www\.)?github\.com\/(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/,
      "Invalid GitHub profile URL"
    )
    .optional()
    .or(z.literal("")),

  linkedin: z
  .string()
  .url()
  .regex(
    /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/,
    "Invalid LinkedIn profile URL"
  )
  .optional()
  .or(z.literal("")),

  twitter: z
    .string()
    .url()
    .regex(
      /^https:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}$/,
      "Invalid Twitter/X profile URL"
    )
    .optional()
    .or(z.literal("")),
}).refine((obj) => obj.github || obj.linkedin || obj.twitter, {
  message: "At least one social link must be provided",
});