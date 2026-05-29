export const commentValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            commentId: req.body?.commentId,
            text: req.body?.text,
            postId: req.body?.postId
        }
        try {
            schema.parse(object);
            console.log("✅ Validation passed");
            next();
        } catch (error) {
            try {
                console.log("❌ Validation failed:", error);
            } catch (error) {
                console.log("❌ Validation failed", error.errors);
            }
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error
            });
        }

    }
}