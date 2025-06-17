import { z } from "zod";

export const forgotPasswdSchema = z.object({
    identifier: z.union([
    z.string().email(),
    z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "User Name can only contain letters, numbers, and underscores",
    })
    ])
})