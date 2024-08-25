import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import typesController from "../../controllers/dataControllers/typesController.js";

const router = express.Router();
/**
 * @route GET /types
 * @desc Mendapatkan daftar types
 */
router.get("/types", authenticateToken, async (req, res, next) => {
  try {
    const result = await typesController.getAllTypes(req, res);
    console.log("Types berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Types:", error);
    next(error);
  }
});
/**
 * @route GET /types
 * @desc Mendapatkan daftar types berdasarkan ID
 */
router.get("/types/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await typesController.getTypeById(req, res);
    console.log("Types berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Types:", error);
    next(error);
  }
});

/**
 * @route POST /types
 * @desc Admin: Membuat types baru
 * @access Private (Admin)
 */
router.post("/types", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await typesController.createType(req, res);
    console.log("Types berhasil dibuat oleh admin:", result);
  } catch (error) {
    console.error("Gagal membuat Types oleh admin:", error);
    next(error);
  }
});

/**
 * @route PATCH /admin/types/:id
 * @desc admin: Mengedit types
 * @access Private (admin)
 */
router.patch(
  "/types/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await typesController.updateType(req, res);
      console.log("Types berhasil diperbarui oleh admin:", result);
    } catch (error) {
      console.error("Gagal memperbarui Types oleh admin:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /types/:id
 * @desc admin: Menghapus types
 * @access Private (admin)
 */
router.delete(
  "/types/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await typesController.deleteType(req, res);
      console.log("Types berhasil dihapus oleh admin:", result);
    } catch (error) {
      console.error("Gagal menghapus Types oleh admin:", error);
      next(error);
    }
  }
);
export default router;
