import { getUnseenNotif as getUnseenNotifRepository } from "../repository/notificationRepository.js";

export const getUnseenNotif = async({ userName }) => {
    const notifications = await getUnseenNotifRepository({ userName });

    return notifications;
}