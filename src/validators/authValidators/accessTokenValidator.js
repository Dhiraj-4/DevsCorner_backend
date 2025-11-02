import jwt from 'jsonwebtoken';
import { ACCESS_SECRET_KEY} from "../../config/serverConfig.js";
import { getMe } from "../../repository/userRepository.js"

export const accessTokenValidator = async(req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access token missing or malformed',
            success: false
        });
    }
    const accessToken = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken, ACCESS_SECRET_KEY);
        const { userName } = decoded;
        const user = await getMe({ userName });
        if (!user) {
            return res.status(401).json({ message: "Invalid user", success: false });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired access token', success: false });
    }
}