import { z } from "zod";

export const fileSchema = z.object({
    fileName: z.string(),
    fileType: z.string()
});