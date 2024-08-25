import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import featureController from "../../controllers/dataControllers/featureController.js";

const router = express.Router();

/**
 * @route GET /feature
 * @desc Mendapatkan daftar feature
 */
router.get("/feature", authenticateToken, async (req, res, next) => {
  try {
    const result = await featureController.getAllFeature(req, res);
    console.log("Feature berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Feature", error);
    next(error);
  }
});

/**
 * @route GET /feature/:id
 * @desc Mendapatkan daftar feature berdasarkan ID
 */
router.get("/feature/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await featureController.getFeatureById(req, res);
    console.log("Feature berdasarkan ID berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Feature berdasarkan ID", error);
    next(error);
  }
});

/**
 * @route POST /feature
 * @desc Admin: Membuat feature baru
 * @access Private (Admin)
 */
router.post("/feature", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await featureController.createFeature(req, res);
    console.log("Feature berhasil dibuatn:", result);
  } catch (error) {
    console.error("Gagal membuat Feature", error);
    next(error);
  }
});

/**
 * @route PATCH /feature/:id
 * @desc admin: Mengedit feature
 * @access Private (admin)
 */
router.patch(
  "/feature/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await featureController.updateFeature(req, res);
      console.log("Feature berhasil diperbarui:", result);
    } catch (error) {
      console.error("Gagal memperbarui Feature:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /feature/:id
 * @desc admin: Menghapus feature
 * @access Private (admin)
 */
router.delete(
  "/feature/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await featureController.deleteFeature(req, res);
      console.log("Feature berhasil dihapus:", result);
    } catch (error) {
      console.error("Gagal menghapus Feature:", error);
      next(error);
    }
  }
);

export default router;
