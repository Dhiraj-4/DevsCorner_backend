import { errorResponse, successResponse } from "../utils/responseHelper.js";
import {
    createPost as createPostService,
    updateText as updateTextService,
    toggleLike as toggleLikeService,
    toggleDislike as toggleDislikeService,
    deletePost as deletePostService,
    getOwnersPosts as getOwnersPostsService,
    getPosts as getPostsService
} from "../service/postService.js";

export const createPost = async(req, res) => {
    try {
        const post = await createPostService({
            userName: req.user.userName,
            text: req.body.text
        });

        return successResponse({
            message: "created post",
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
        const post = await updateTextService({
            userName: req.user.userName,
            text: req.body.text,
            postId: req.body.postId
        });

        return successResponse({
            message: "updated post text",
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
            postId: req.body.postId
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
            postId: req.body.postId
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

export const deletePost = async(req, res) => {
    try {
        await deletePostService({
            userName: req.user.userName,
            postId: req.body.postId
        })

        return successResponse({
            message: "post deleted",
            status: 200,
            res: res,
            info: ""
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getOwnersPosts = async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 10;

        const posts = await getOwnersPostsService({
            userName: req.user.userName,
            page,
            limit
        });

        let hasMore = (limit === posts.length);

        return successResponse({
            message: "Fetched user's posts",
            status: 200,
            res: res,
            info: [ posts, hasMore ]
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getPosts = async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 10;

        const posts = await getPostsService({
            page,
            limit
        });

        let hasMore = (limit === posts.length);

        return successResponse({
            message: "Fetched posts",
            status: 200,
            res: res,
            info: [ posts, hasMore ]
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}