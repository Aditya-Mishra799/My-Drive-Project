import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";

const logActivity = async (fileId, userId, action) => {
    const query = `
        INSERT INTO file_activity_log (file_id, user_id, action, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, file_id, user_id, action, created_at
    `;
    const values = [fileId, userId, action];
    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

const getFileActivity = async (fileId, limit = 50, offset = 0) => {
    const countQuery = `SELECT COUNT(*) FROM file_activity_log WHERE file_id = $1`;
    const query = `
        SELECT fal.id, fal.file_id, fal.user_id, fal.action, fal.created_at,
               u.name as user_name, u.email as user_email
        FROM file_activity_log fal
        JOIN users u ON fal.user_id = u.id
        WHERE fal.file_id = $1
        ORDER BY fal.created_at DESC
        LIMIT $2 OFFSET $3
    `;
    try {
        const { rows: countRows } = await pool.query(countQuery, [fileId]);
        const total = parseInt(countRows[0].count);
        const { rows } = await pool.query(query, [fileId, limit, offset]);
        return { activities: rows, total };
    } catch (error) {
        throw new ApiError(500, "Failed to get file activity", "DATABASE_ERROR", { originalError: error.message });
    }
};

const getUserActivity = async (userId, limit = 50, offset = 0) => {
    const countQuery = `SELECT COUNT(*) FROM file_activity_log WHERE user_id = $1`;
    const query = `
        SELECT fal.id, fal.file_id, fal.user_id, fal.action, fal.created_at,
               f.filename, f.file_type
        FROM file_activity_log fal
        JOIN files f ON fal.file_id = f.id
        WHERE fal.user_id = $1
        ORDER BY fal.created_at DESC
        LIMIT $2 OFFSET $3
    `;
    try {
        const { rows: countRows } = await pool.query(countQuery, [userId]);
        const total = parseInt(countRows[0].count);
        const { rows } = await pool.query(query, [userId, limit, offset]);
        return { activities: rows, total };
    } catch (error) {
        throw new ApiError(500, "Failed to get user activity", "DATABASE_ERROR", { originalError: error.message });
    }
};

export {
    logActivity,
    getFileActivity,
    getUserActivity
};
