import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../../config/serverConfig.js";
import { User } from "../../schema/userSchema.js";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuthValidator = async(req, res, next) => {
    try {
        const token = req.body?.token;

        if(!token) {
            throw {
                message: "google auth token missing",
                status: 403
            }
        }

        // Verify token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID, // match the client id
        });

        const payload = ticket.getPayload();
        console.log(payload);
        const { email } = payload;

        const user = await User.findOne({ email });
        
        if(!user) req.message = "Create user";
        else req.message = "Login user";

        req.user = payload;
        next();
    } catch (error) {
        console.log("Error from googleAuthValidator: ",error);
        res.status(500).json({
            message: "google auth validation failed",
            error: error
        });
    }
}