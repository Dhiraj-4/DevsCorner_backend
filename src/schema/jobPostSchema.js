import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    owner: {
      type: String, // username of the user
      required: true,
    },

    jobId: {
      type: String,
      required: true,
      unique: true
    },

    text: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 3000,
    },

    applyLink: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "indie",
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);