import { getFileById } from "../services/file.service.js";
import ApiError from "../utils/ApiError.js";

const checkFileOwnership = async (req, res, next) => {
    const fileId = req.params.fileId || req.body.fileId;
    const userId = req.user.id;

    try {
        const file = await getFileById(fileId);
        if (!file) {
            throw new ApiError(404, "File not found", "FILE_NOT_FOUND");
        }

        if (file.owner_id !== userId) {
            throw new ApiError(403, "You do not have permission to perform this action", "FORBIDDEN");
        }

        req.file_record = file;
        next();
    } catch (error) {
        next(error);
    }
};

export { checkFileOwnership };
