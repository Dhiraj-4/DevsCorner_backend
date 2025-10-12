import { getMe as getMeRepository } from "../repository/userRepository.js"
import { v4 as uuidv4 } from "uuid";
import leoProfanity from 'leo-profanity';
import {
    createPost as createPostRepository,
    getPost as getPostRepository,
    updateText as updateTextRepository,
    deletePost as deletePostRepository,
    getOwnersPosts as getOwnersPostsRepository,
    getPosts as getPostsRepository
} from "../repository/postRepository.js";

export const createPost = async({ userName, text }) => {
    const user = await getMeRepository({ userName });

    const postId = uuidv4();
    let cleanText = leoProfanity.clean(text);

    const post = await createPostRepository({
        owner: user._id,
        text: cleanText,
        postId
    });

    return post;
}

export const updateText = async({ userName, text, postId }) => {
    const user = await getMeRepository({ userName });
    const post = await getPostRepository({ postId });

    if(String(user._id) !== String(post.owner)) throw { status: 403, message: "invalid owner" };

    const updatedPost = await updateTextRepository({
        text,
        postId
    });

    return updatedPost;
}

export const toggleLike = async({ userName, postId }) => {
    const user = await getMeRepository({ userName });
    const post = await getPostRepository({ postId });

    let isLiked = post.likes.some( (id) => id.toString() === user._id.toString());

    if(isLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== user._id.toString());
        post.countLikes = ((post.countLikes - 1) < 0) ? 0 :  (post.countLikes - 1) ;

        await post.save();
        return { message: "removed liked", post };
    }
    else {
        post.likes.push(user._id);
        post.countLikes = post.countLikes + 1;

        post.dislikes = post.dislikes.filter( (id) => id.toString() !== user._id.toString());
        post.countDislikes = ((post.countDislikes - 1) < 0) ? 0 :  (post.countDislikes - 1);

        await post.save();
        return { message: "liked", post };
    }
}

export const toggleDislike = async({ userName, postId }) => {
    const user = await getMeRepository({ userName });
    const post = await getPostRepository({ postId });

    let isDisliked = post.dislikes.some( (id) => id.toString() === user._id.toString());

    if(isDisliked) {
        post.dislikes = post.dislikes.filter((id) => id.toString() !== user._id.toString());
        post.countDislikes = ((post.countDislikes - 1) < 0) ? 0 :  (post.countDislikes - 1);

        await post.save();
        return { message: "removed dislike", post };
    }
    else {
        post.dislikes.push(user._id);
        post.countDislikes = post.countDislikes + 1;

        post.likes = post.likes.filter((id) => id.toString() !== user._id.toString());
        post.countLikes = ((post.countLikes - 1) < 0) ? 0 :  (post.countLikes - 1) ;

        await post.save();
        return { message: "disliked", post };
    }
}

export const deletePost = async({ userName, postId }) => {
    const user = await getMeRepository({ userName });
    const post = await getPostRepository({ postId });

    if(user._id.toString() != post.owner.toString()) throw { message: "invalid owner", status: 403 };

    await deletePostRepository({ postId });
    return;
}

export const getOwnersPosts = async({ userName, page, limit }) => {
    const skip = (page - 1) * limit;

    const posts = await getOwnersPostsRepository({
        userName,
        limit,
        skip
    });

    return posts;
}

export const getPosts = async({ page, limit }) => {
    const skip = (page - 1) * limit;

    const posts = await getPostsRepository({
        limit,
        skip
    });

    return posts;
}