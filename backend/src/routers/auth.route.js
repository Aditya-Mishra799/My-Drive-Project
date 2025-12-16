import express from "express";
import { login, signup, logout, getUserDetails } from "../controllers/auth.controller.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/user", requireAuth, getUserDetails)
export default router;
