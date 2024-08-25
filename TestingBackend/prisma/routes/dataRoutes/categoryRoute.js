import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import categoryController from "../../controllers/dataControllers/categoryController.js";

const router = express.Router();

/**
 * @route GET /category
 * @desc Mendapatkan daftar category
 */
router.get("/category", authenticateToken, async (req, res, next) => {
  try {
    const result = await categoryController.getAllCategory(req, res);
    console.log("Category berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Category", error);
    next(error);
  }
});

/**
 * @route GET /category/:id
 * @desc Mendapatkan daftar category berdasarkan ID
 */
router.get("/category/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await categoryController.getCategoryById(req, res);
    console.log("Category berdasarkan ID berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Category berdasarkan ID", error);
    next(error);
  }
});

/**
 * @route POST /category
 * @desc Admin: Membuat category baru
 * @access Private (Admin)
 */
router.post("/category", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await categoryController.createCategory(req, res);
    console.log("Category berhasil dibuatn:", result);
  } catch (error) {
    console.error("Gagal membuat Category", error);
    next(error);
  }
});

/**
 * @route PATCH /category/:id
 * @desc admin: Mengedit category
 * @access Private (admin)
 */
router.patch(
  "/category/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await categoryController.updateCategory(req, res);
      console.log("Category berhasil diperbarui:", result);
    } catch (error) {
      console.error("Gagal memperbarui Category:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /category/:id
 * @desc admin: Menghapus category
 * @access Private (admin)
 */
router.delete(
  "/category/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await categoryController.deleteCategory(req, res);
      console.log("Category berhasil dihapus:", result);
    } catch (error) {
      console.error("Gagal menghapus Category:", error);
      next(error);
    }
  }
);

export default router;
