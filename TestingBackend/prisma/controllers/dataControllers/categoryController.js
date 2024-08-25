import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Categorys
 */
const categoryController = {
  /**
   * Mendapatkan semua data Categorys dengan pagination
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllCategory: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalCategory = await prisma.vehicleCategory.count();

      // Ambil data dengan pagination
      const result = await prisma.vehicleCategory.findMany({
        orderBy: { id: "asc" },
        skip: skipInt,
        take: limitInt,
        select: {
          id: true,
          name: true,
          vehicleType: {
            select: {
              name: true, // Hanya ambil nama dari vehicleType
            },
          },
        },
      });

      if (category.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data kategori ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Kategori berhasil diambil",
        metadata: {
          total: totalCategory,
          limit: limitInt,
          skip: skipInt,
        },
        data: result,
      });
    } catch (error) {
      console.error("Error dalam getAllCategorys:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mendapatkan data Categorys berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const category = await prisma.vehicleCategory.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          vehicleType: {
            select: {
              name: true, // Ambil nama dari vehicleType
            },
          },
        },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Kategori tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Kategori berhasil diambil berdasarkan ID",
        data: category,
      });
    } catch (error) {
      console.error("Error dalam getCategoryById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menambahkan data Categorys baru
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createCategory: async (req, res) => {
    try {
      const { name, typeId } = req.body;

      // Validasi Input
      if (!name || !typeId) {
        return res.status(400).json({
          success: false,
          message: "Input Nama & Type tidak boleh kosong",
        });
      }

      // Validasi Nama Kategori
      const existingCategory = await prisma.vehicleCategory.findFirst({
        where: { name },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Nama Kategori sudah ada",
        });
      }

      // Validasi ID Tipe
      const existingType = await prisma.vehicleType.findFirst({
        where: { id: typeId },
      });

      if (!existingType) {
        return res.status(400).json({
          success: false,
          message: "ID Tipe tidak ditemukan",
        });
      }

      const newCategory = await prisma.vehicleCategory.create({
        data: {
          name,
          vehicleType: { connect: { id: typeId } },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Kategori berhasil dibuat",
        data: newCategory,
      });
    } catch (error) {
      console.error("Error dalam createCategory:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengupdate data Categorys berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, brandId } = req.body;

      const existingCategory = await prisma.vehicleCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "ID Kategori tidak ditemukan",
        });
      }

      const updatedCategory = await prisma.vehicleCategory.update({
        where: { id },
        data: {
          name: name || existingCategory.name,
          typeId: typeId || existingCategory.typeId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Kategori berhasil diupdate",
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Error dalam updateCategory:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menghapus data Categorys berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const existingCategory = await prisma.vehicleCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Kategori tidak ditemukan",
        });
      }

      await prisma.vehicleCategory.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Kategori berhasil dihapus",
      });
    } catch (error) {
      console.error("Error dalam deleteCategory:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default categoryController;
