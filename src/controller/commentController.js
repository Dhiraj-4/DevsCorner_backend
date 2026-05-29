import { errorResponse, successResponse } from "../utils/responseHelper.js";
import {
    createComment as createCommentService,
    updateText as updateTextService,
    toggleLike as toggleLikeService,
    toggleDislike as toggleDislikeService,
    deleteComment as deleteCommentService,
    // getOwnersPosts as getOwnersPostsService,
    getComments as getCommentsService
} from "../service/commentService.js";

export const createComment = async(req, res) => {
    try {
        const post = await createCommentService({
            userName: req.user.userName,
            text: req.body.text,
            postId: req.body.postId
        });

        return successResponse({
            message: "created comment",
            status: 201,
            res: res,
            info: post
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateText = async(req, res) => {
    try {
        const comment = await updateTextService({
            userName: req.user.userName,
            text: req.body.text,
            commentId: req.body.commentId
        });

        return successResponse({
            message: "updated comment text",
            status: 200,
            res: res,
            info: post
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const toggleLike = async(req, res) => {
    try {
        const response = await toggleLikeService({
            userName: req.user.userName,
            commentId: req.body.commentId
        });

        return successResponse({
            message: response.message,
            status: 200,
            res: res,
            info: response.post
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const toggleDislike = async(req, res) => {
    try {
        const response = await toggleDislikeService({
            userName: req.user.userName,
            commentId: req.body.commentId
        });

        return successResponse({
            message: response.message,
            status: 200,
            res: res,
            info: response.post
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteComment = async(req, res) => {
    try {
        await deleteCommentService({
            userName: req.user.userName,
            commentId: req.body.commentId
        })

        return successResponse({
            message: "comment deleted",
            status: 200,
            res: res,
            info: ""
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

// export const getOwnersPosts = async(req, res) => {
//     try {
//         const page = req.query.page || 1;
//         const limit = 10;

//         const posts = await getOwnersPostsService({
//             userName: req.user.userName,
//             page,
//             limit
//         });

//         let hasMore = (limit === posts.length);

//         return successResponse({
//             message: "Fetched user's posts",
//             status: 200,
//             res: res,
//             info: [ posts, hasMore ]
//         });
//     } catch (error) {
//         return errorResponse({ error, res });
//     }
// }

export const getComments = async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 10;

        const comments = await getCommentsService({
            page,
            limit
        });

        let hasMore = (limit === comments.length);

        return successResponse({
            message: "Fetched comments",
            status: 200,
            res: res,
            info: [ comments, hasMore ]
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}