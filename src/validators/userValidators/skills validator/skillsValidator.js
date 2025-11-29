export const skillsValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            skill: req.body?.skill
        }
        try {
            schema.parse(object);
            console.log("✅ Validation passed");
            next();
        } catch (error) {
            try {
                console.log("❌ Validation failed", error.errors);
            } catch(error) {
                console.log("❌ Validation failed");
            }
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error
            });
        }
}
}