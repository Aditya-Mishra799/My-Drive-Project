import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const generateAccessToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token", "INVALID_TOKEN");
    }
}