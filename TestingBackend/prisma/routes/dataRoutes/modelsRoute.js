import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import modelsController from "../../controllers/dataControllers/modelsController.js";

const router = express.Router();
/**
 * @route GET /models
 * @desc Mendapatkan daftar models
 */
router.get("/models", authenticateToken, async (req, res, next) => {
  try {
    const result = await modelsController.getAllModels(req, res);
    console.log("Models berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Models:", error);
    next(error);
  }
});
/**
 * @route GET /models
 * @desc Mendapatkan daftar models berdasarkan ID
 */
router.get("/models/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await modelsController.getModelById(req, res);
    console.log("Models berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Models:", error);
    next(error);
  }
});

/**
 * @route POST /models
 * @desc Admin: Membuat models baru
 * @access Private (Admin)
 */
router.post("/models", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await modelsController.createModel(req, res);
    console.log("Models berhasil dibuat oleh admin:", result);
  } catch (error) {
    console.error("Gagal membuat Models oleh admin:", error);
    next(error);
  }
});

/**
 * @route PATCH /admin/models/:id
 * @desc admin: Mengedit models
 * @access Private (admin)
 */
router.patch(
  "/models/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await modelsController.updateModel(req, res);
      console.log("Models berhasil diperbarui oleh admin:", result);
    } catch (error) {
      console.error("Gagal memperbarui Models oleh admin:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /models/:id
 * @desc admin: Menghapus models
 * @access Private (admin)
 */
router.delete(
  "/models/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await modelsController.deleteModel(req, res);
      console.log("Models berhasil dihapus oleh admin:", result);
    } catch (error) {
      console.error("Gagal menghapus Models oleh admin:", error);
      next(error);
    }
  }
);
export default router;
