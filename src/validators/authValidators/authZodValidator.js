export const authValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
            fullName: req.body.fullName,
            role: req.body.role,
            identifier: req.body.identifier
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