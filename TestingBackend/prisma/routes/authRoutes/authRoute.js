import express from "express";
import authControllers from "../../controllers/authControllers/authController.js";

const router = express.Router();

// Routes untuk login
router.post("/auth/login", authControllers.handleLogin);

// Routes untuk pendaftaran pegawai
router.post("/auth/register", authControllers.UserRegister);

export default router;
