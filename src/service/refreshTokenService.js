import { ACCESS_SECRET_KEY } from "../config/serverConfig.js";
import jwt from 'jsonwebtoken';

export const renewAccessToken = async({ userName }) => {

    const accessToken = jwt.sign({ userName }, ACCESS_SECRET_KEY, { expiresIn: '15m' });
    return accessToken;
}