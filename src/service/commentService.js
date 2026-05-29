import { getMe as getMeRepository } from "../repository/userRepository.js";
import { v4 as uuidv4 } from "uuid";
import leoProfanity from 'leo-profanity';
import {
    createComment as createCommentRepository,
    updateText as updateTextRepository,
    deleteComment as deleteCommentRepository,
    // getOwnersCommnets as getOwnersCommnetsRepository,
    getComments as getCommentsRepository
} from "../repository/commentRepository.js";
import { notify } from "../socket/socketHandlers.js";
import { getPost as getPostRepository } from "../repository/postRepository.js";

export const createComment = async({ userName, text, postId }) => {
    const user = await getMeRepository({ userName });

    const commentId = uuidv4();
    let cleanText = leoProfanity.clean(text);
    if(!getPost({ postId })) throw { status: 400, message: "Invalid post id"};

    const comment = await createCommentRepository({
        owner: user._id,
        text: cleanText,
        postId,
        commentId
    });

    commnet.from = userName;
    await notify("comment", comment);
    
    return comment;
}

export const updateText = async({ userName, text, commentId }) => {
    const user = await getMeRepository({ userName });
    const comment = await Comment.fineOne({ commentId });
    const cleanText = leoProfanity.clean(text);
    if(String(user._id) !== String(comment.owner)) throw { status: 403, message: "invalid owner" };

    const updatedComment = await updateTextRepository({
        text: cleanText,
        commentId
    });

    return updatedComment;
}

export const toggleLike = async({ userName, commentId }) => {
    const user = await getMeRepository({ userName });
    const comment = await getCommentRepository({ commentId });

    let isLiked = comment.likes.some( (id) => id.toString() === user._id.toString());

    if(isLiked) {
        comment.likes = comment.likes.filter((id) => id.toString() !== user._id.toString());
        comment.countLikes = ((comment.countLikes - 1) < 0) ? 0 :  (comment.countLikes - 1) ;

        await comment.save();
        return { message: "removed liked", comment };
    }
    else {
        comment.likes.push(user._id);
        comment.countLikes = comment.countLikes + 1;

        comment.dislikes = comment.dislikes.filter( (id) => id.toString() !== user._id.toString());
        comment.countDislikes = ((comment.countDislikes - 1) < 0) ? 0 :  (comment.countDislikes - 1);

        await comment.save();
        return { message: "liked", comment };
    }
}

export const toggleDislike = async({ userName, commentId }) => {
    const user = await getMeRepository({ userName });
    const comment = await getCommentRepository({ commentId });

    let isDisliked = comment.dislikes.some( (id) => id.toString() === user._id.toString());

    if(isDisliked) {
        comment.dislikes = comment.dislikes.filter((id) => id.toString() !== user._id.toString());
        comment.countDislikes = ((comment.countDislikes - 1) < 0) ? 0 :  (comment.countDislikes - 1);

        await comment.save();
        return { message: "removed dislike", comment };
    }
    else {
        comment.dislikes.push(user._id);
        comment.countDislikes = comment.countDislikes + 1;

        comment.likes = comment.likes.filter((id) => id.toString() !== user._id.toString());
        comment.countLikes = ((comment.countLikes - 1) < 0) ? 0 :  (comment.countLikes - 1) ;

        await comment.save();
        return { message: "disliked", comment };
    }
}

export const deleteComment = async({ userName, commentId }) => {
    const user = await getMeRepository({ userName });
    const comment = await getCommentRepository({ commentId });

    if(user._id.toString() != comment.owner.toString()) throw { message: "invalid owner", status: 403 };

    await deleteCommentRepository({ commentId });
    return;
}

// export const getOwnersPosts = async({ userName, page, limit }) => {
//     const skip = (page - 1) * limit;

//     const posts = await getOwnersPostsRepository({
//         userName,
//         limit,
//         skip
//     });

//     return posts;
// }

export const getComments = async({ page, limit }) => {
    const skip = (page - 1) * limit;

    const comments = await getCommentsRepository({
        limit,
        skip
    });

    return comments;
}