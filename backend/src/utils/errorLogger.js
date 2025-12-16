import ApiError from "./ApiError.js";
const NODE_ENV = process.env.NODE_ENV || "development";
const logError = (err, req) => {
    if (NODE_ENV === "production") return;

    console.error("------ ERROR LOG START ------");
    console.error("Time:", new Date().toISOString());
    console.error("Route:", req.method, req.originalUrl);

    if (err instanceof ApiError) {
        console.error("Error Type:", err.errorBody.type);
        console.error("Status Code:", err.status);
        console.error("Message:", err.message);
        if (Object.keys(err.details || {}).length > 0) {
            console.error("Details:", err.details);
        }
    } else {
        console.error("Unhandled Error:", err.message);
    }
}
export default logError;