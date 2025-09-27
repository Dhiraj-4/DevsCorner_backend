export const jobValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            text: req.body?.text,
            applyLink: req.body?.applyLink,
            companyName: req.body?.companyName,
            role: req.body?.role
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