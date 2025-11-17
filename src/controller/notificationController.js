import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { 
    getUnseenNotif as getUnseenNotifService,
    deleteNotif as deleteNotifService
} from "../service/notificationService.js";

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

export const deleteNotif = async(req, res) => {
    try {
        const id = req.body?.id;
        if(!id) throw { status: 400, message: "Missing notification id" };

        await deleteNotifService({ id, userName: req.user.userName });

        return successResponse({
            message: "notification deleted",
            status: 200,
            res: res
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}