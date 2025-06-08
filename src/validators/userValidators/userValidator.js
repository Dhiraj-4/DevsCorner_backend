export const userValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            fullName: req.body.fullName,
            bio: req.body.bio,
            role: req.body.role,
            socials: req.body.socials,
            location: req.body.location,
            website: req.body.website
        }
        try {
            schema.parse(object);
            console.log("✅ Validation passed");
            next();
        } catch (error) {
            console.log("❌ Validation failed:", error.errors);
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error.error
            });
        }

    }
}