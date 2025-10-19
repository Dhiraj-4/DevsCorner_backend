import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
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
      maxlength: 500,
    },

    brandImage: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
      max: 50
    },

    location: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 80
    },

    locationType: {
      type: String,
      required: true,
      default: "",
      minLength: 6,
      maxLength: 10
    },

    salary: {
      type: String,
      default: "Not disclosed",
      maxLength: 50
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