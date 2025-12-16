class ApiError extends Error {
    constructor(status, message = "Something went wrong", type = "GENERAL_ERROR", details = {}) {
        super(message);
        this.status = status;
        this.errorBody = {
            message,
            type,
            details,
            status,
        }
    }

}
export default ApiError;