import { 
    getUnseenNotif as getUnseenNotifRepository,
    deleteNotif as deleteNotifRepository
} from "../repository/notificationRepository.js";

export const getUnseenNotif = async({ userName }) => {
    const notifications = await getUnseenNotifRepository({ userName });

    return notifications;
}

export const deleteNotif = async({ userName, id }) => {
    await deleteNotifRepository({ userName, id });

    return;
}