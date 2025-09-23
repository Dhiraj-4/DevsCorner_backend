import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    owner: {
      type: String, // username of the user
      required: true,
    },

    text: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 3000,
    },

    image: {
      type: String,
      default: "",
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
    timestamps: true, // createdAt & updatedAt
  }
);

export const Job = mongoose.model("Job", jobSchema);