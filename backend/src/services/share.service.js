import pool from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { v4 as uuidv4 } from "uuid";

const shareFileWithUser = async (fileId, sharedWithUserId, expiresAt = null) => {
    const checkQuery = `
        SELECT id FROM file_shares
        WHERE file_id = $1 AND shared_with_user_id = $2
    `;
    try {
        const { rows: existing } = await pool.query(checkQuery, [fileId, sharedWithUserId]);
        if (existing.length > 0) {
            throw new ApiError(400, "File already shared with this user", "DUPLICATE_SHARE");
        }

        const query = `
            INSERT INTO file_shares (file_id, shared_with_user_id, role, expires_at, created_at)
            VALUES ($1, $2, 'viewer', $3, NOW())
            RETURNING id, file_id, shared_with_user_id, role, expires_at, created_at
        `;
        const values = [fileId, sharedWithUserId, expiresAt];
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Failed to share file", "DATABASE_ERROR", { originalError: error.message });
    }
};

const removeFileShare = async (fileId, sharedWithUserId) => {
    const query = `
        DELETE FROM file_shares
        WHERE file_id = $1 AND shared_with_user_id = $2
    `;
    try {
        await pool.query(query, [fileId, sharedWithUserId]);
    } catch (error) {
        throw new ApiError(500, "Failed to remove file share", "DATABASE_ERROR", { originalError: error.message });
    }
};

const getFileShares = async (fileId) => {
    const query = `
        SELECT fs.id, fs.file_id, fs.shared_with_user_id, fs.role, fs.expires_at, fs.created_at,
               u.name as user_name, u.email as user_email
        FROM file_shares fs
        JOIN users u ON fs.shared_with_user_id = u.id
        WHERE fs.file_id = $1
        ORDER BY fs.created_at DESC
    `;
    try {
        const { rows } = await pool.query(query, [fileId]);
        return rows;
    } catch (error) {
        throw new ApiError(500, "Failed to get file shares", "DATABASE_ERROR", { originalError: error.message });
    }
};

const createShareableLink = async (fileId, createdBy, expiresAt = null) => {
    const token = uuidv4();
    const query = `
        INSERT INTO shareable_links (file_id, token, created_by, expires_at, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id, file_id, token, created_by, expires_at, created_at
    `;
    const values = [fileId, token, createdBy, expiresAt];
    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw new ApiError(500, "Failed to create shareable link", "DATABASE_ERROR", { originalError: error.message });
    }
};

const getShareableLinks = async (fileId) => {
    const query = `
        SELECT id, file_id, token, created_by, expires_at, created_at
        FROM shareable_links
        WHERE file_id = $1
        ORDER BY created_at DESC
    `;
    try {
        const { rows } = await pool.query(query, [fileId]);
        return rows;
    } catch (error) {
        throw new ApiError(500, "Failed to get shareable links", "DATABASE_ERROR", { originalError: error.message });
    }
};

const deleteShareableLink = async (linkId) => {
    const query = `DELETE FROM shareable_links WHERE id = $1`;
    try {
        await pool.query(query, [linkId]);
    } catch (error) {
        throw new ApiError(500, "Failed to delete shareable link", "DATABASE_ERROR", { originalError: error.message });
    }
};

const validateShareableLink = async (token) => {
    const query = `
        SELECT sl.id, sl.file_id, sl.expires_at, f.filename, f.file_type, f.s3_key
        FROM shareable_links sl
        JOIN files f ON sl.file_id = f.id
        WHERE sl.token = $1
        AND (sl.expires_at IS NULL OR sl.expires_at > NOW())
    `;
    try {
        const { rows } = await pool.query(query, [token]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw new ApiError(500, "Failed to validate shareable link", "DATABASE_ERROR", { originalError: error.message });
    }
};

export {
    shareFileWithUser,
    removeFileShare,
    getFileShares,
    createShareableLink,
    getShareableLinks,
    deleteShareableLink,
    validateShareableLink
};
