export const userValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            fullName: req.body.fullName,
            email: req.body.email,
            bio: req.body.bio,
            resume: req.body.resume,
            skills: req.body.skills,
            location: req.body.location,
            socials: req.body.socials,
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