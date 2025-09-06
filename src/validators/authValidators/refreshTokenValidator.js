import jwt from 'jsonwebtoken';
import { REFRESH_SECRET_KEY } from "../../config/serverConfig.js";

export const refreshTokenValidator = (req, res, next) => {

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: 'Refresh token missing or malformed',
            success: false
        });
    }

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid or expired refresh token',
                success: false
            });
        }

        req.user = decoded;
        next();
    });
};