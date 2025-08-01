import jwt from 'jsonwebtoken';
import { OTP_SECRET_KEY } from "../../config/serverConfig.js";

export const optTokenValidator = async(req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access token missing or malformed',
            success: false
        });
    }
    const accessToken = authHeader.split(' ')[1];

    jwt.verify(accessToken, OTP_SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(403).json({
                message: 'Invalid or expired access token',
                success: false
            });
        }
        req.user = decoded;
        next();
    })
}