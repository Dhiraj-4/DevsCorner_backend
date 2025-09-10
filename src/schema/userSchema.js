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
      match: [/^[a-zA-Z0-9_]+$/, "User Name can only contain letters, numbers, and underscores"]
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
      type: {
        code: String,      // hashed
        expiresAt: Date,
      },
      select: false,
      default: {}
    },

    otp: {
      type: {
        code: String,      // hashed
        expiresAt: Date,
      },
      select: false,
      default: {}
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 3000,
    },

    location: { type: String },

    skills: [String],

    socialLinks: {
      github: String,
      linkedin: String,
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