import { Notification } from "../schema/notificationSchema.js"
import { getMe } from "./userRepository.js"


export const getUnseenNotif = async({ userName }) => {
    const user = await getMe({ userName });

    const notifications = await Notification.find({
      userId: user._id
    }).sort({ createdAt: -1 });

    return notifications;
}