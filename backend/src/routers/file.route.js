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


const router = express.Router();

router.post("/upload", requireAuth, upload.single("file"), uploadFile);
router.post("/upload/multiple", requireAuth, upload.array("files", 10), uploadMultipleFiles);
router.get("/my-files", requireAuth, getUserFiles);
router.get("/shared-with-me", requireAuth, getSharedFiles);
router.get("/:fileId/download", requireAuth, downloadFile);
router.delete("/:fileId", requireAuth, checkFileOwnership, deleteUserFile);