import { Post } from "../schema/postSchema.js";
import { User } from "../schema/userSchema.js";

export const createPost = async({ owner, postId, text }) => {
    const post = await Post.findOne({ postId });

    if(post) throw { message: "duplicate postId", status: 400 };

    const newPost = await Post.create({ owner, postId, text });

    return newPost;
}

export const getPost = async({ postId }) => {
    const post = await Post.findOne({ postId });

    if(!post) throw { message: "Invalid post id", status: 400 };

    return post;
}

export const updateText = async({ text, postId }) => {
    const post = await Post.findOneAndUpdate({ postId }, { text }, { new: true });
    return post;
}

export const deletePost = async({ postId }) => {
    await Post.findOneAndDelete({ postId });
    return;
}

export const getOwnersPosts = async ({ userName, limit, skip }) => {
    const user = await User.findOne({ userName }).select("_id");
    if (!user) return [];

    const posts = await Post.find({ owner: user._id })
                          .skip(skip)
                          .limit(limit)
                          .populate("owner", "fullName userName profileImage")
                          .sort({ updatedAt: -1 });

    return posts;
};

export const getPosts = async ({ limit, skip }) => {
  const posts = await Post.find()
    .skip(skip)
    .limit(limit)
    .populate("owner", "fullName userName profileImage")
    .sort({ updatedAt: -1 });

  return posts;
};