export const bioFullNameValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            fullName: req.body?.fullName,
            bio: req.body?.bio
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