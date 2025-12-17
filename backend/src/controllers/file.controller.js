import { createFile, getFilesByOwner, getFilesSharedWithUser, deleteFile, checkFileAccess } from "../services/file.service.js";
import StorageFactory from "../storage/storage.factory.js";
import { compressFile, decompressFile, shouldCompress } from "../utils/compression.js";
import { logActivity } from "../services/activity.service.js";
import ApiError from "../utils/ApiError.js";
import { v4 as uuidv4 } from "uuid";

const storage = StorageFactory.createStorage("s3");

const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new ApiError(400, "No file uploaded", "NO_FILE");
        }

        const userId = req.user.id;
        const { originalname, mimetype, size, buffer } = req.file;

        const isCompressed = req.body.compressed === 'true';
        let fileBuffer = buffer;
        let actualSize = size;

        if (!isCompressed && shouldCompress(mimetype)) {
            fileBuffer = compressFile(buffer);
            actualSize = fileBuffer.length;
        }

        const s3Key = `${userId}/${uuidv4()}-${originalname}`;
        await storage.upload(s3Key, fileBuffer, mimetype);

        const fileRecord = await createFile(userId, originalname, mimetype, actualSize, s3Key);
        await logActivity(fileRecord.id, userId, "upload");

        res.status(201).json({
            success: true,
            data: fileRecord,
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
};

const uploadMultipleFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new ApiError(400, "No files uploaded", "NO_FILES");
        }

        const userId = req.user.id;
        const uploadedFiles = [];

        for (const file of req.files) {
            const { originalname, mimetype, size, buffer } = file;

            const isCompressed = req.body.compressed === 'true';
            let fileBuffer = buffer;
            let actualSize = size;

            if (!isCompressed && shouldCompress(mimetype)) {
                fileBuffer = compressFile(buffer);
                actualSize = fileBuffer.length;
            }

            const s3Key = `${userId}/${uuidv4()}-${originalname}`;
            await storage.upload(s3Key, fileBuffer, mimetype);

            const fileRecord = await createFile(userId, originalname, mimetype, actualSize, s3Key);
            await logActivity(fileRecord.id, userId, "upload");
            uploadedFiles.push(fileRecord);
        }

        res.status(201).json({
            success: true,
            data: uploadedFiles,
        });
    } catch (error) {
        next(error);
    }
};

const getUserFiles = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const result = await getFilesByOwner(userId, limit, offset);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getSharedFiles = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const result = await getFilesSharedWithUser(userId, limit, offset);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const downloadFile = async (req, res, next) => {
    try {
        const fileId = parseInt(req.params.fileId);
        const userId = req.user.id;

        const file = await checkFileAccess(fileId, userId);
        if (!file) {
            throw new ApiError(403, "Access denied", "ACCESS_DENIED");
        }

        let fileBuffer = await storage.download(file.s3_key);

        if (shouldCompress(file.file_type)) {
            try {
                fileBuffer = decompressFile(fileBuffer);
            } catch (err) {
                console.log("File not compressed, sending as is");
            }
        }

        await logActivity(fileId, userId, "download");

        res.setHeader("Content-Type", file.file_type);
        res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
        res.send(fileBuffer);
    } catch (error) {
        next(error);
    }
};

const deleteUserFile = async (req, res, next) => {
    try {
        const file = req.file_record;

        await storage.delete(file.s3_key);
        await deleteFile(file.id);

        res.status(200).json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export {
    uploadFile,
    uploadMultipleFiles,
    getUserFiles,
    getSharedFiles,
    downloadFile,
    deleteUserFile,
};
