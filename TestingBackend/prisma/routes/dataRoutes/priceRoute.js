import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import priceController from "../../controllers/dataControllers/priceController.js";

const router = express.Router();
/**
 * @route GET /price
 * @desc Mendapatkan daftar price
 */
router.get("/price", authenticateToken, async (req, res, next) => {
  try {
    const result = await priceController.getAllPrices(req, res);
    console.log("Price berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Price:", error);
    next(error);
  }
});
/**
 * @route GET /price
 * @desc Mendapatkan daftar price berdasarkan ID
 */
router.get("/price/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await priceController.getPriceById(req, res);
    console.log("Price berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Price:", error);
    next(error);
  }
});

/**
 * @route POST /price
 * @desc Admin: Membuat price baru
 * @access Private (Admin)
 */
router.post("/price", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await priceController.createPrice(req, res);
    console.log("Price berhasil dibuat oleh admin:", result);
  } catch (error) {
    console.error("Gagal membuat Price oleh admin:", error);
    next(error);
  }
});

/**
 * @route PATCH /admin/price/:id
 * @desc admin: Mengedit price
 * @access Private (admin)
 */
router.patch(
  "/price/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await priceController.updatePrice(req, res);
      console.log("Price berhasil diperbarui oleh admin:", result);
    } catch (error) {
      console.error("Gagal memperbarui Price oleh admin:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /price/:id
 * @desc admin: Menghapus price
 * @access Private (admin)
 */
router.delete(
  "/price/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await priceController.deletePrice(req, res);
      console.log("Price berhasil dihapus oleh admin:", result);
    } catch (error) {
      console.error("Gagal menghapus Price oleh admin:", error);
      next(error);
    }
  }
);
export default router;
