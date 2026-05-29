import { z } from "zod";

export function commentZodSchema(filter) {

    if(filter == "create") {
        return z.object({
            postId: z.string().uuid(),
            text: z.string().min(1).max(500),
        });
    }
    else if(filter == "update-text") {
        return z.object({
            commentId: z.string().uuid(),
            text: z.string().min(1).max(500),
        });
    }
    else if(filter == "delete") {
        return z.object({
            commentId: z.string().uuid()
        });
    }
    else if(filter == "toggle-reaction") {
        return z.object({
            commentId: z.string().uuid()
        });
    }
    else {
        throw new Error("Invalid filter type")
    }
}