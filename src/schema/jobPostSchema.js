import mongoose from "mongoose";
import { maxLength, minLength, required } from "zod/v4-mini";

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

    role: {
      type: String,
      default: "",
      minLength: 5,
      maxLength: 30,
      required: true
    },

    companyName: {
      type: String,
      default: "indie",
      minLength: 1,
      maxLength: 50
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);