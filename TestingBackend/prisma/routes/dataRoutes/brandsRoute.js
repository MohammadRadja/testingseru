import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import brandsController from "../../controllers/dataControllers/brandsController.js";

const router = express.Router();

/**
 * @route GET /brands
 * @desc Mendapatkan daftar brands
 */
router.get("/brands", authenticateToken, async (req, res, next) => {
  try {
    const result = await brandsController.getAllBrands(req, res);
    console.log("Brands berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Brands", error);
    next(error);
  }
});

/**
 * @route GET /brands/:id
 * @desc Mendapatkan daftar brands berdasarkan ID
 */
router.get("/brands/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await brandsController.getBrandById(req, res);
    console.log("Brands berdasarkan ID berhasil diambil", result);
  } catch (error) {
    console.error("Gagal mendapatkan Brands berdasarkan ID", error);
    next(error);
  }
});

/**
 * @route POST /brands
 * @desc Admin: Membuat brands baru
 * @access Private (Admin)
 */
router.post("/brands", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await brandsController.createBrand(req, res);
    console.log("Brands berhasil dibuat oleh admin:", result);
  } catch (error) {
    console.error("Gagal membuat Brands oleh admin:", error);
    next(error);
  }
});

/**
 * @route PATCH /brands/:id
 * @desc admin: Mengedit brands
 * @access Private (admin)
 */
router.patch(
  "/brands/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await brandsController.updateBrand(req, res);
      console.log("Brands berhasil diperbarui oleh admin:", result);
    } catch (error) {
      console.error("Gagal memperbarui Brands oleh admin:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /brands/:id
 * @desc admin: Menghapus brands
 * @access Private (admin)
 */
router.delete(
  "/brands/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await brandsController.deleteBrand(req, res);
      console.log("Brands berhasil dihapus oleh admin:", result);
    } catch (error) {
      console.error("Gagal menghapus Brands oleh admin:", error);
      next(error);
    }
  }
);

export default router;
