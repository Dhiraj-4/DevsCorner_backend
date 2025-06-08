import { z } from "zod";

export const forgotPasswdSchema = z.object({
    identifier: z.union([
    z.string().email(),
    z.string().min(3).max(30)
    ])
})