import {
    shareFileWithUser,
    removeFileShare,
    getFileShares,
    createShareableLink,
    getShareableLinks,
    deleteShareableLink,
    validateShareableLink,
} from "../services/share.service.js";
import { checkFileAccess } from "../services/file.service.js";
import { logActivity } from "../services/activity.service.js";
import { getUserByEmail } from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";

const shareWithUser = async (req, res, next) => {
    try {
        const file = req.file_record;
        const { userEmail, expiresAt } = req.body;

        if (!userEmail) {
            throw new ApiError(400, "User email is required", "MISSING_EMAIL");
        }

        const targetUser = await getUserByEmail(userEmail);
        if (!targetUser) {
            throw new ApiError(404, "User not found", "USER_NOT_FOUND");
        }

        if (targetUser.id === req.user.id) {
            throw new ApiError(400, "Cannot share file with yourself", "INVALID_SHARE");
        }

        const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
        const share = await shareFileWithUser(file.id, targetUser.id, expiresAtDate);
        await logActivity(file.id, req.user.id, "share");

        res.status(201).json({
            success: true,
            data: share,
        });
    } catch (error) {
        next(error);
    }
};

const unshareWithUser = async (req, res, next) => {
    try {
        const file = req.file_record;
        const { userId } = req.body;

        if (!userId) {
            throw new ApiError(400, "User ID is required", "MISSING_USER_ID");
        }

        await removeFileShare(file.id, userId);

        res.status(200).json({
            success: true,
            message: "File share removed successfully",
        });
    } catch (error) {
        next(error);
    }
};

const listFileShares = async (req, res, next) => {
    try {
        const file = req.file_record;
        const shares = await getFileShares(file.id);

        res.status(200).json({
            success: true,
            data: shares,
        });
    } catch (error) {
        next(error);
    }
};

const generateShareableLink = async (req, res, next) => {
    try {
        const file = req.file_record;
        const { expiresAt } = req.body;

        const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
        const link = await createShareableLink(file.id, req.user.id, expiresAtDate);
        await logActivity(file.id, req.user.id, "create_link");

        res.status(201).json({
            success: true,
            data: link,
        });
    } catch (error) {
        next(error);
    }
};

const listShareableLinks = async (req, res, next) => {
    try {
        const file = req.file_record;
        const links = await getShareableLinks(file.id);

        res.status(200).json({
            success: true,
            data: links,
        });
    } catch (error) {
        next(error);
    }
};

const removeShareableLink = async (req, res, next) => {
    try {
        const { linkId } = req.params;
        await deleteShareableLink(linkId);

        res.status(200).json({
            success: true,
            message: "Shareable link removed successfully",
        });
    } catch (error) {
        next(error);
    }
};

const accessViaLink = async (req, res, next) => {
    try {
        const { token } = req.params;
        const userId = req.user.id;

        const linkData = await validateShareableLink(token);
        if (!linkData) {
            throw new ApiError(404, "Invalid or expired link", "INVALID_LINK");
        }

        await logActivity(linkData.file_id, userId, "access_via_link");

        res.status(200).json({
            success: true,
            data: {
                fileId: linkData.file_id,
                filename: linkData.filename,
                fileType: linkData.file_type,
            },
        });
    } catch (error) {
        next(error);
    }
};

export {
    shareWithUser,
    unshareWithUser,
    listFileShares,
    generateShareableLink,
    listShareableLinks,
    removeShareableLink,
    accessViaLink,
};
