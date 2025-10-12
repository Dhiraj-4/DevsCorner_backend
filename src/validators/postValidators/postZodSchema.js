import { z } from "zod";

export const postZodSchema = (filter) => {

    if(filter == "create") {
        return z.object({
            text: z.string().min(1).max(300),
        });
    }else if(filter == "update-text") {
        return z.object({
            postId: z.string().uuid(),
            text: z.string().min(1).max(300)
        });
    }else if(filter == "toggle-reaction") {
        return z.object({
            postId: z.string().uuid()
        });
    }else if(filter == "delete") {
        return z.object({
            postId: z.string().uuid()
        });
    }
}