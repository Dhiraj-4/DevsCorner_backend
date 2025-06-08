import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
    },
    userName: {
      type: String,
      required: [true, "User Name is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9_]+$/, "User Name can only contain letters, numbers, and underscores"],
      lowercase: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // hide in queries
    },

    passwordResetToken: {
      code: String, // hashed
      expiresAt: Date,
      select: false,
      default: {}
    },

    otp: {
      code: String, // hashed
      expiresAt: Date,
      select: false,
      default: {}
    },

    role: {
      type: String,
      enum: ["developer", "employer", "both"],
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 300,
    },

    location: { type: String },

    website: { type: String },

    skills: [String],

    socialLinks: {
      github: String,
      linkedin: String,
      portfolio: String,
      twitter: String,
    },

    resume: {
      type: String,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
    countFollowers: { type: Number, default: 0 },

    countFollowing: { type: Number, default: 0 },

    companyName: {
      type: String,
      required: function () {
        return this.role === "employer";
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);