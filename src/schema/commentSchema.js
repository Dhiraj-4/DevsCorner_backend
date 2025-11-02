import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      commentId : {
        type: String,
        required: true,
        unique: true
      },

      postId: {
        type: String,
        required: true
      },
  
      text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 300,
      },

      likes: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
          }
      ],

      dislikes: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
          }
      ],
      countLikes: { type: Number, default: 0 },
      countDislikes: { type: Number, default: 0 }
  },
  {
      timestamps: true
  }
);

export const Comment = mongoose.model("Comment", commentSchema);