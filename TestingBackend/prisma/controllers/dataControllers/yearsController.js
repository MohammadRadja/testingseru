import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Tahun
 */
const yearsController = {
  /**
   * GET all Years
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllYears: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalYears = await prisma.vehicleYear.count();

      // Ambil data dengan pagination
      const years = await prisma.vehicleYear.findMany({
        orderBy: { id: "asc" },
        skip: skipInt,
        take: limitInt,
      });

      if (years.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data Tahun ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Harga berhasil diambil",
        metadata: {
          total: totalYears,
          limit: limitInt,
          skip: skipInt,
        },
        data: years,
      });
    } catch (error) {
      console.error("Error dalam getAllYears:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET Year by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getYearById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const year = await prisma.vehicleYear.findUnique({
        where: { id },
      });

      if (!year) {
        return res.status(404).json({
          success: false,
          message: "Tahun tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Tahun berhasil diambil berdasarkan ID",
        data: year,
      });
    } catch (error) {
      console.error("Error dalam getYearById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST Create a new Year
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createYear: async (req, res) => {
    try {
      const { year } = req.body;

      if (!year) {
        return res.status(400).json({
          success: false,
          message: "Input Harga tidak boleh kosong",
        });
      }

      const existingYear = await prisma.vehicleYear.findFirst({
        where: { year },
      });

      if (existingYear) {
        return res.status(400).json({
          success: false,
          message: "Tahun sudah ada",
        });
      }

      const newYear = await prisma.vehicleYear.create({
        data: { year },
      });

      return res.status(201).json({
        success: true,
        message: "Harga berhasil dibuat",
        data: newYear,
      });
    } catch (error) {
      console.error("Error dalam createYear:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PATCH Update a Year
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updateYear: async (req, res) => {
    try {
      const { id } = req.params;
      const { year } = req.body;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid",
        });
      }

      const existingYear = await prisma.vehicleYear.findUnique({
        where: { id },
      });

      if (!existingYear) {
        return res.status(404).json({
          success: false,
          message: "ID Tahun tidak ditemukan",
        });
      }

      const updatedYear = await prisma.vehicleYear.update({
        where: { id },
        data: { year: year || existingYear.year },
      });

      return res.status(200).json({
        success: true,
        message: "Tahun berhasil diupdate",
        data: updatedYear,
      });
    } catch (error) {
      console.error("Error dalam updateYear:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * DELETE a Year
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deleteYear: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid",
        });
      }

      const existingYear = await prisma.vehicleYear.findUnique({
        where: { id },
      });

      if (!existingYear) {
        return res.status(404).json({
          success: false,
          message: "ID Tahun tidak ditemukan",
        });
      }

      // Validasi relasi antara Model dan Price
      // const relatedPrice = await prisma.priceList.findMany({
      //   where: { yearId: id },
      // });

      // if (relatedPrice.length > 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message:
      //       "Tidak bisa menghapus Tahun karena masih ada PriceList terkait",
      //   });
      // }

      await prisma.vehicleYear.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Tahun berhasil dihapus",
      });
    } catch (error) {
      console.error("Error dalam deleteYear:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default yearsController;
