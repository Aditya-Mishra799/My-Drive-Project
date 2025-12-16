import ApiError from "../utils/ApiError.js"
import logError from "../utils/errorLogger.js"
const errorHandler = (err, req, res, next) => {
    logError(err, req)
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            success: false,
            error: err.errorBody
        })
    }
    return res.status(500).json({
        success: false,
        error: {
            message: "Internal Server Error",
            type: "SERVER_ERROR",
            status: 500,
            details: {}
        }
    })
}

export default errorHandler;