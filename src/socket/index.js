// socketEvents.js
import { io } from "../app.js";
import { handleConnection } from "./socketHandlers.js";

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => handleConnection(io, socket));
};


export const socketEvents = {
    jobCreated(job) {
        const payload = {
            type: "job",
            jobId: job.jobId,
            role: job.role,
            companyName: job.companyName,
            location: job.location,
            createdAt: job.createdAt,
        };

        io.emit("notification:newJob", payload);
    },

    messageSend(message) {

    }
};
