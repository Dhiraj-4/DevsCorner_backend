export const successResponse = ({ message, res, status, info }) => {

    return res.status(status).json({
        message: message,
        success: true,
        info: info
    })
}

export const errorResponse = ({ error, res }) => {
    console.log("This is the error", error);

    if(error.status) {
        return res.status(error.status).json({
            message: error.message,
            success: false
        });
    }

    return res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: error.error
    });
}