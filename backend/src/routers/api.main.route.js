import express from "express";
import authRouter from "./auth.route.js";
import fileRouter from "./file.route.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/files", fileRouter);
export default router;