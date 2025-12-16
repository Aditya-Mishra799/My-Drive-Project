import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";

const createFile = async (ownerId, filename, fileType, fileSize, s3Key) => {
    const query = `
        INSERT INTO files (owner_id, filename, file_type, file_size, s3_key, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id, owner_id, filename, file_type, file_size, s3_key, created_at, updated_at
    `;
    const values = [ownerId, filename, fileType, fileSize, s3Key];
    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw new ApiError(500, "Failed to create file record", "DATABASE_ERROR", { originalError: error.message });
    }
};

const getFileById = async (fileId) => {
    const query = `SELECT * FROM files WHERE id = $1`;
    try {
        const { rows } = await pool.query(query, [fileId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw new ApiError(500, "Failed to get file", "DATABASE_ERROR", { originalError: error.message });
    }
};

const getFilesByOwner = async (ownerId, limit = 50, offset = 0) => {
    const countQuery = `SELECT COUNT(*) FROM files WHERE owner_id = $1`;
    const query = `
        SELECT id, owner_id, filename, file_type, file_size, s3_key, created_at, updated_at
        FROM files
        WHERE owner_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
    `;
    try {
        const { rows: countRows } = await pool.query(countQuery, [ownerId]);
        const total = parseInt(countRows[0].count);
        const { rows } = await pool.query(query, [ownerId, limit, offset]);
        return { files: rows, total };
    } catch (error) {
        throw new ApiError(500, "Failed to get files by owner", "DATABASE_ERROR", { originalError: error.message });
    }
};

const getFilesSharedWithUser = async (userId, limit = 50, offset = 0) => {
    const countQuery = `
        SELECT COUNT(*)
        FROM file_shares fs
        WHERE fs.shared_with_user_id = $1
        AND (fs.expires_at IS NULL OR fs.expires_at > NOW())
    `;
    const query = `
        SELECT f.id, f.owner_id, f.filename, f.file_type, f.file_size, f.created_at,
               u.name as owner_name, fs.role, fs.expires_at
        FROM files f
        JOIN file_shares fs ON f.id = fs.file_id
        JOIN users u ON f.owner_id = u.id
        WHERE fs.shared_with_user_id = $1
        AND (fs.expires_at IS NULL OR fs.expires_at > NOW())
        ORDER BY fs.created_at DESC
        LIMIT $2 OFFSET $3
    `;
    try {
        const { rows: countRows } = await pool.query(countQuery, [userId]);
        const total = parseInt(countRows[0].count);
        const { rows } = await pool.query(query, [userId, limit, offset]);
        return { files: rows, total };
    } catch (error) {
        throw new ApiError(500, "Failed to get shared files", "DATABASE_ERROR", { originalError: error.message });
    }
};

const deleteFile = async (fileId) => {
    const query = `DELETE FROM files WHERE id = $1`;
    try {
        await pool.query(query, [fileId]);
    } catch (error) {
        throw new ApiError(500, "Failed to delete file", "DATABASE_ERROR", { originalError: error.message });
    }
};

const checkFileAccess = async (fileId, userId) => {
    const query = `
        SELECT f.id, f.owner_id, f.s3_key, f.filename, f.file_type
        FROM files f
        LEFT JOIN file_shares fs ON f.id = fs.file_id AND fs.shared_with_user_id = $2
        WHERE f.id = $1
        AND (
            f.owner_id = $2
            OR (fs.id IS NOT NULL AND (fs.expires_at IS NULL OR fs.expires_at > NOW()))
        )
    `;
    try {
        const { rows } = await pool.query(query, [fileId, userId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw new ApiError(500, "Failed to check file access", "DATABASE_ERROR", { originalError: error.message });
    }
};

export {
    createFile,
    getFileById,
    getFilesByOwner,
    getFilesSharedWithUser,
    deleteFile,
    checkFileAccess
};
