import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import upload from "../middleware/upload.js";
import { checkFileOwnership } from "../middleware/fileAuth.js";
import {
    uploadFile,
    uploadMultipleFiles,
    getUserFiles,
    getSharedFiles,
    downloadFile,
    deleteUserFile,
} from "../controllers/file.controller.js";
import {
    shareWithUser,
    unshareWithUser,
    listFileShares,
    generateShareableLink,
    listShareableLinks,
    removeShareableLink,
    accessViaLink,
} from "../controllers/share.controller.js";
import {
    getFileActivityLog,
    getUserActivityLog,
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/upload", requireAuth, upload.single("file"), uploadFile);
router.post("/upload/multiple", requireAuth, upload.array("files", 10), uploadMultipleFiles);
router.get("/my-files", requireAuth, getUserFiles);
router.get("/shared-with-me", requireAuth, getSharedFiles);
router.get("/:fileId/download", requireAuth, downloadFile);
router.delete("/:fileId", requireAuth, checkFileOwnership, deleteUserFile);

router.post("/:fileId/share/user", requireAuth, checkFileOwnership, shareWithUser);
router.delete("/:fileId/share/user", requireAuth, checkFileOwnership, unshareWithUser);
router.get("/:fileId/shares", requireAuth, checkFileOwnership, listFileShares);

router.post("/:fileId/share/link", requireAuth, checkFileOwnership, generateShareableLink);
router.get("/:fileId/share/links", requireAuth, checkFileOwnership, listShareableLinks);
router.delete("/share/link/:linkId", requireAuth, removeShareableLink);
router.get("/share/link/:token", requireAuth, accessViaLink);

router.get("/:fileId/activity", requireAuth, checkFileOwnership, getFileActivityLog);
router.get("/activity/me", requireAuth, getUserActivityLog);

export default router;
