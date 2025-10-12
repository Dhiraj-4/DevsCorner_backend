export const postValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            postId: req.body?.postId,
            text: req.body?.text
        }
        try {
            schema.parse(object);
            console.log("✅ Validation passed");
            next();
        } catch (error) {
            console.log("❌ Validation failed:", error);
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error
            });
        }

    }
}