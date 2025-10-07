import { z } from "zod";

export function jobZodSchema(filter) {

    if(filter == "create") {
        return z.object({

            role: z.string().min(5).max(30),

            text: z.string().min(50).max(500),

            applyLink: z.string().url().optional(),

            companyName: z.string().min(1).max(50).optional()
        });
    }
    else if(filter == "update-text") {
        return z.object({
            jobId: z.string().uuid(),
            text: z.string().min(50).max(500),
        });
    }
    else if(filter == "update-applylink") {
        return z.object({
            jobId: z.string().uuid(),
            applyLink: z.string().url()
        });
    }else if(filter == "update-companyname") {
        return z.object({
            jobId: z.string().uuid(),
            companyName: z.string().min(1).max(50)
        })
    }else if(filter == "update-role") {
        return z.object({
            jobId: z.string().uuid(),
            role: z.string().min(5).max(30)
        })
    }
    else if(filter == "delete") {
        return z.object({
            jobId: z.string().uuid()
        })
    }
    else {
        throw new Error("Invalid filter type")
    }
}