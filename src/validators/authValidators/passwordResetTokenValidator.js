import { PASSWORD_SECRET_KEY } from "../../config/serverConfig.js";
import jwt from 'jsonwebtoken';

export const passwordResetTokenValidator = async(req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access token missing or malformed',
            success: false
        });
    }
    const accessToken = authHeader.split(' ')[1];

    jwt.verify(accessToken, PASSWORD_SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(403).json({
                message: 'Invalid or expired access token',
                success: false
            });
        }
        decoded.passwordResetToken = accessToken;
        req.user = decoded;
        next();
    });
}