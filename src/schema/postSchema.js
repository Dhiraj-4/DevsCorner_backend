import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        owner: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User",
          required: true
        },
    
        postId: {
          type: String,
          required: true,
          unique: true
        },
    
        text: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 300,
        },

        commentIds : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],

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

export const Post = mongoose.model("Post", postSchema);