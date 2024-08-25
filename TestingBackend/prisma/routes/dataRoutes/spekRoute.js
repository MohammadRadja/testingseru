import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import spekController from "../../controllers/dataControllers/spekController.js";

const router = express.Router();

/**
 * @route GET /spek
 * @desc Mendapatkan daftar spek
 */
router.get("/spek", authenticateToken, async (req, res, next) => {
  try {
    const result = await spekController.getAllSpecification(req, res);
    console.log("Spek berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Spek", error);
    next(error);
  }
});

/**
 * @route GET /spek/:id
 * @desc Mendapatkan daftar spek berdasarkan ID
 */
router.get("/spek/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await spekController.getSpecificationById(req, res);
    console.log("Spek berdasarkan ID berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Spek berdasarkan ID", error);
    next(error);
  }
});

/**
 * @route POST /spek
 * @desc Admin: Membuat spek baru
 * @access Private (Admin)
 */
router.post("/spek", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await spekController.createSpecification(req, res);
    console.log("Spek berhasil dibuatn:", result);
  } catch (error) {
    console.error("Gagal membuat Spek", error);
    next(error);
  }
});

/**
 * @route PATCH /spek/:id
 * @desc admin: Mengedit spek
 * @access Private (admin)
 */
router.patch(
  "/spek/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await spekController.updateSpecification(req, res);
      console.log("Spek berhasil diperbarui:", result);
    } catch (error) {
      console.error("Gagal memperbarui Spek:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /spek/:id
 * @desc admin: Menghapus spek
 * @access Private (admin)
 */
router.delete(
  "/spek/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await spekController.deleteSpecification(req, res);
      console.log("Spek berhasil dihapus:", result);
    } catch (error) {
      console.error("Gagal menghapus Spek:", error);
      next(error);
    }
  }
);

export default router;
