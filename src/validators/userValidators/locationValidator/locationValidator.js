export const locationValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            location: req.body?.location
        }
        try {
            schema.parse(object);
            console.log("✅ Validation passed");
            next();
        } catch (error) {
            try {
                console.log("❌ Validation failed:", error);
            } catch (error) {
                console.error("Error logging validation failure:", error.errors);
            }
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error
            });
        }
}
}