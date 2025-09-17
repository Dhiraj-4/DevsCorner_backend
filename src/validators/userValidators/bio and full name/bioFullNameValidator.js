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
            console.log("❌ Validation failed:", error);
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error
            });
        }

    }
}