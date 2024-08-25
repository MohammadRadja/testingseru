import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Vehicle Brands
 */
const brandController = {
  /**
   * GET all vehicle brands
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllBrands: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalBrands = await prisma.vehicleBrand.count();

      // Ambil data dengan pagination
      const result = await prisma.vehicleBrand.findMany({
        orderBy: { id: "asc" },
        skip: skipInt,
        take: limitInt,
      });

      // Cek apakah ada data
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data brands ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Brands berhasil diambil",
        metadata: {
          total: totalBrands,
          limit: limitInt,
          skip: skipInt,
        },
        data: result,
      });
    } catch (error) {
      console.error("Error dalam getAllBrands:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET a single vehicle brand by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getBrandById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const result = await prisma.vehicleBrand.findUnique({
        where: { id },
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Brand tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Brand berhasil diambil berdasarkan ID",
        data: result,
      });
    } catch (error) {
      console.error("Error dalam getBrandById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST create a new vehicle brand
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createBrand: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Input Nama tidak boleh kosong",
        });
      }

      const existingBrand = await prisma.vehicleBrand.findFirst({
        where: { name },
      });

      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Nama Brand sudah ada",
        });
      }

      const result = await prisma.vehicleBrand.create({
        data: { name },
      });

      return res.status(201).json({
        success: true,
        message: "Brand berhasil dibuat",
        data: result,
      });
    } catch (error) {
      console.error("Error dalam createBrand:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PATCH update an existing vehicle brand by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updateBrand: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Validasi input
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Nama tidak boleh kosong",
        });
      }

      // Validasi Brands
      const brandExists = await prisma.vehicleBrand.findUnique({
        where: { id },
      });

      if (!brandExists) {
        return res.status(404).json({
          success: false,
          message: "Brand tidak ditemukan",
        });
      }

      const result = await prisma.vehicleBrand.update({
        where: { id },
        data: { name },
      });

      return res.status(200).json({
        success: true,
        message: "Brand berhasil diupdate",
        data: result,
      });
    } catch (error) {
      console.error("Error dalam updateBrand:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * DELETE remove a vehicle brand by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deleteBrand: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi Brands
      const brandExists = await prisma.vehicleBrand.findUnique({
        where: { id },
      });

      if (!brandExists) {
        return res.status(404).json({
          success: false,
          message: "Brand tidak ditemukan",
        });
      }

      // Validasi relasi antara Brand dan Type
      // const relatedTypes = await prisma.vehicleType.findMany({
      //   where: { brandId: id },
      // });

      // if (relatedTypes.length > 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Tidak bisa menghapus Type karena masih ada Model terkait",
      //   });
      // }

      const result = await prisma.vehicleBrand.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Brand berhasil dihapus, termasuk pada Type terkait",
        data: result,
      });
    } catch (error) {
      console.error("Error dalam deleteBrand:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default brandController;
