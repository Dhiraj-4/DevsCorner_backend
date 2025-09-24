import { z } from "zod";

export const jobZodSchema = z.object({
    jobId: z.string().optional(),

    text: z.string().min(50).max(3000),

    applyLink: z.string().url().optional(),

    companyName: z.string().min(1).max(150).optional()
});