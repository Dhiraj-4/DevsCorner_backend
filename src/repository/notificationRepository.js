import { Notification } from "../schema/notificationSchema.js"
import { getMe } from "./userRepository.js"


export const getUnseenNotif = async({ userName }) => {
    const user = await getMe({ userName });

    const notifications = await Notification.find({
      userId: user._id
    }).sort({ createdAt: -1 });

    return notifications;
}

export const deleteNotif = async({ userName, id }) => {
  const user = await getMe({ userName });

  const notif = await Notification.findById(id).select("userId");

  if (!notif) throw { status: 404, message: "Notification not found" };

  if(notif.userId.toString() !== user._id.toString()) {
    throw { status: 403, message: "Not authorised" };
  }

  await Notification.findByIdAndDelete(id);

  return;
}