export const authValidator = (schema) => {
    return (req, res, next) => {
        const object = {
            email: req.body?.email,
            userName: req.body?.userName,
            password: req.body?.password,
            fullName: req.body?.fullName,
            identifier: req.body?.identifier
        }
        try {
            console.log(object);
            
            schema.parse(object);
            console.log("✅ Validation passed");
            next();
        } catch (error) {
            try {
                console.log("❌ Validation failed:", error);
            }catch(err) {
                console.log("❌ Validation failed:", error.errors);
            }
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error
            });
        }

    }
}