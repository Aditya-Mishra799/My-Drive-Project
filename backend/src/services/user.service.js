import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
const addUser = async (username, email, passwordHash) => {
    const query = 'INSERT INTO users (name, email, password_hash, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at, updated_at';
    const values = [username, email, passwordHash];
    try {
        const {rows} = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw new ApiError(500, "Failed to add user", "DATABASE_ERROR", { originalError: error });
    }
}
const checkUserExists = async (email) => {
    const query = 'SELECT id FROM users WHERE email = $1';
    const values = [email];
    try {
        const {rows} = await pool.query(query, values);
        return rows.length > 0;
    } catch (error) {
        throw new ApiError(500, "Failed to check user existence", "DATABASE_ERROR", { originalError: error });
    }
}

const getUserByEmail = async (email) => {
    const query = 'SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = $1';
    const values = [email];
    try {
        const {rows} = await pool.query(query, values);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        throw new ApiError(500, "Failed to get user by email", "DATABASE_ERROR", { originalError: error });
    }
}
const getUserById = async (id) => {
    const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1';
    const values = [id];
    try {
        const {rows} = await pool.query(query, values);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        throw new ApiError(500, "Failed to get user by id", "DATABASE_ERROR", { originalError: error });
    }
}

export { addUser, checkUserExists, getUserByEmail, getUserById };