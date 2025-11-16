import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { getUnseenNotif as getUnseenNotifService } from "../service/notificationService.js";

export const getUnseenNotif = async(req, res) => {
    try {
        const notifications = await getUnseenNotifService({
            userName: req.user.userName
        });

        return successResponse({
            message: "fetched notifications",
            status: 200,
            res: res,
            info: notifications
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}