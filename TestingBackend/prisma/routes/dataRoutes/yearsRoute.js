import express from "express";
import {
  authenticateToken,
  isAdmin,
} from "../../middlewares/authMiddleware.js";
import yearsController from "../../controllers/dataControllers/yearsController.js";

const router = express.Router();
/**
 * @route GET /years
 * @desc Mendapatkan daftar years
 */
router.get("/years", authenticateToken, async (req, res, next) => {
  try {
    const result = await yearsController.getAllYears(req, res);
    console.log("Years berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Years:", error);
    next(error);
  }
});
/**
 * @route GET /years
 * @desc Mendapatkan daftar years berdasarkan ID
 */
router.get("/years/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await yearsController.getYearById(req, res);
    console.log("Years berhasil diambil:", result);
  } catch (error) {
    console.error("Gagal mendapatkan Years:", error);
    next(error);
  }
});

/**
 * @route POST /years
 * @desc Admin: Membuat years baru
 * @access Private (Admin)
 */
router.post("/years", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const result = await yearsController.createYear(req, res);
    console.log("Years berhasil dibuat oleh admin:", result);
  } catch (error) {
    console.error("Gagal membuat Years oleh admin:", error);
    next(error);
  }
});

/**
 * @route PATCH /admin/years/:id
 * @desc admin: Mengedit years
 * @access Private (admin)
 */
router.patch(
  "/years/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await yearsController.updateYear(req, res);
      console.log("Years berhasil diperbarui oleh admin:", result);
    } catch (error) {
      console.error("Gagal memperbarui Years oleh admin:", error);
      next(error);
    }
  }
);

/**
 * @route DELETE /years/:id
 * @desc admin: Menghapus years
 * @access Private (admin)
 */
router.delete(
  "/years/:id",
  authenticateToken,
  isAdmin,
  async (req, res, next) => {
    try {
      const result = await yearsController.deleteYear(req, res);
      console.log("Years berhasil dihapus oleh admin:", result);
    } catch (error) {
      console.error("Gagal menghapus Years oleh admin:", error);
      next(error);
    }
  }
);
export default router;
