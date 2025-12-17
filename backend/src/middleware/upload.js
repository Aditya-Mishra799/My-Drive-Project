import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        /* -------------------- Images -------------------- */
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
        'image/tiff',
        'image/heic',
        'image/heif',

        /* -------------------- PDFs & Text -------------------- */
        'application/pdf',
        'text/plain',
        'text/csv',
        'text/markdown',
        'application/json',
        'application/xml',

        /* -------------------- Word / Docs -------------------- */
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',

        /* -------------------- Excel / Sheets -------------------- */
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.spreadsheet',

        /* -------------------- PowerPoint -------------------- */
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.oasis.opendocument.presentation',

        /* -------------------- Archives -------------------- */
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/vnd.rar',
        'application/x-7z-compressed',
        'application/gzip',
        'application/x-tar',

        /* -------------------- Audio -------------------- */
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/ogg',
        'audio/webm',
        'audio/aac',
        'audio/flac',

        /* -------------------- Video -------------------- */
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'video/webm',

        /* -------------------- Code / Dev Files -------------------- */
        'text/html',
        'text/css',
        'application/javascript',
        'text/javascript',
        'application/typescript',
        'application/x-sh',
        'application/x-python',
        'application/java',
        'application/x-httpd-php',

        /* -------------------- Misc -------------------- */
        'application/octet-stream'
    ];


    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Invalid file type", "INVALID_FILE_TYPE"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1.3*1024*1024,
    },
});

export default upload;
