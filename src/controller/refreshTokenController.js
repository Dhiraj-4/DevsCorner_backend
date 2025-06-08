import { renewAccessToken as renewAccessTokenService } from '../service/refreshTokenService.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';

export const renewAccessToken = async(req, res) => {
    try {
        const accessToken = await renewAccessTokenService({
            userName: req.user.userName
        });

        return successResponse({
            message: "AccessToken renewed",
            res: res,
            info: accessToken,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}