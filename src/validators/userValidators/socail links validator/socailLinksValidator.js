export const socialLinksValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            github: req.body?.socialLinks?.github,
            twitter: req.body?.socialLinks?.twitter,
            linkedin: req.body?.socialLinks?.linkedin,
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