import { Comment } from "../schema/commentSchema.js";
import { Post } from "../schema/postSchema.js";
import { User } from "../schema/userSchema.js";

export const createComment = async({ owner, postId, text, commnetId }) => {
    const comment = await Comment.findOne({ commentId });

    if(comment) throw { message: "duplicate commentId", status: 400 };

    const newComment = await Comment.create({ owner, postId, text, commentId });

    return newComment;
}

export const getComment = async({ commnetId }) => {
    const comment = await Comment.findOne({ commentId });

    if(!comment) throw { message: "Invalid comment id", status: 400 };

    return comment;
}

export const updateText = async({ text, commentId }) => {
    const comment = await Comment.findOneAndUpdate({ commentId }, { text }, { new: true });
    return comment;
}

export const deleteComment = async({ commentId }) => {
    await Comment.findOneAndDelete({ commentId });
    return;
}

// export const getOwnersPosts = async ({ userName, limit, skip }) => {
//     const user = await User.findOne({ userName }).select("_id");
//     if (!user) return [];

//     const posts = await Post.find({ owner: user._id })
//                           .skip(skip)
//                           .limit(limit)
//                           .populate("owner", "fullName userName profileImage")
//                           .sort({ updatedAt: -1 });

//     return posts;
// };

export const getComments = async ({ limit, skip }) => {
  const comments = await Comment.find()
    .skip(skip)
    .limit(limit)
    .populate("owner", "fullName userName profileImage")
    .sort({ updatedAt: -1 });

  return comment;
};