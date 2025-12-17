import pool from "../config/db.js";
import { addUser, checkUserExists, getUserByEmail, getUserById } from "../services/user.service.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/jwt.js";
import settings from "../config/settings.js";

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        if (await checkUserExists(email)) {
            throw new ApiError(400, "User with this email already exists", "USER_EXISTS");
        }
        const passwordHash = await hashPassword(password);
        const { password_hash, ...rest } = await addUser(name, email, passwordHash);
        return res.status(201).json({
            success: true,
            data: rest
        });
    } catch (error) {
        next(error)
    }
}

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  maxAge: settings.cookieExpiry.timeMS,
  secure: isProd,          
  sameSite: isProd ? "none" : "lax",
  path: "/",         
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
        }
        const passwordMatch = await comparePassword(password, user.password_hash);
        if (!passwordMatch) {
            throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
        }
        res.cookie(
            "token",
            generateAccessToken(
                { userId: user.id },
                settings.cookieExpiry.timeString
            ),
            cookieOptions
        );
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        });

    } catch (error) {
        next(error)
    }
}

const logout = (req, res, next) => {
    try {
        res.clearCookie("token", cookieOptions);
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error);
    }
}
const getUserDetails = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const user = await getUserById(userId);
        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
}
export { signup, login, logout, getUserDetails };