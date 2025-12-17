import { getFileActivity, getUserActivity } from "../services/activity.service.js";

const getFileActivityLog = async (req, res, next) => {
    try {
        const file = req.file_record;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const result = await getFileActivity(file.id, limit, offset);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getUserActivityLog = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const result = await getUserActivity(userId, limit, offset);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getFileActivityLog,
    getUserActivityLog,
};
