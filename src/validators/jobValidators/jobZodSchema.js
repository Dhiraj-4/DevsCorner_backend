import { z } from "zod";

export function jobZodSchema(filter) {

    if(filter == "create") {
        return z.object({

            role: z.string().min(5).max(30),

            text: z.string().min(50).max(500),

            applyLink: z.string().url().optional(),

            companyName: z.string().min(1).max(50).optional(),

            location: z.string().min(2).max(80),

            experience: z.number().min(0).max(50).optional(),

            locationType: z.string().min(5).max(10),

            salary: z.string().max(50).optional()
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
    }else if(filter == "update-location") {
        return z.object({
            jobId: z.string().uuid(),
            location: z.string().min(2).max(80)
        });
    }else if(filter == "udpate-locationType") {
        return z.object({
            jobId: z.string().uuid(),
            locationType: z.string().min(6).max(10)
        });
    }else if(filter == "update-salary") {
        return z.object({
            jobId: z.string().uuid(),
            salary: z.string().max(50)
        });
    }else if(filter == "update-experience") {
        return z.object({
            jobId: z.string().uuid(),
            experience: z.number().min(0).max(50)
        });
    }else if(filter == "generate-upload-url") {
        return z.object({
            jobId: z.string().uuid(),
            fileType: z.string(),
            fileName: z.string()
        });
    }else if(filter == "upload-brand-image") {
        return z.object({
            jobId: z.string().uuid(),
            fileUrl: z.string()
        });
    }
    else {
        throw new Error("Invalid filter type")
    }
}