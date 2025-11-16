// schema/notificationSchema.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String, required: true },
    type: { type: String, required: true }, // job, post, message
    data: { type: Object, default: {} },
    seen: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model("Notification", NotificationSchema);