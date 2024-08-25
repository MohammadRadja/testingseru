import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Features
 */
const featureController = {
  /**
   * Mendapatkan semua data Features dengan pagination
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllFeature: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalFeature = await prisma.vehicleFeature.count();

      // Ambil data dengan pagination
      const result = await prisma.vehicleFeature.findMany({
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

      if (feature.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada Data Fitur ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil diambil",
        metadata: {
          total: totalFeature,
          limit: limitInt,
          skip: skipInt,
        },
        data: result,
      });
    } catch (error) {
      console.error("Error dalam getAllFeatures:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mendapatkan data Features berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getFeatureById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const feature = await prisma.vehicleFeature.findUnique({
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

      if (!feature) {
        return res.status(404).json({
          success: false,
          message: "Fitur tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil diambil berdasarkan ID",
        data: feature,
      });
    } catch (error) {
      console.error("Error dalam getFeatureById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menambahkan data Features baru
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createFeature: async (req, res) => {
    try {
      const { name, typeId } = req.body;

      // Validasi Input
      if (!name || !typeId) {
        return res.status(400).json({
          success: false,
          message: "Input Nama & Type tidak boleh kosong",
        });
      }

      // Validasi Nama Fitur
      const existingFeature = await prisma.vehicleFeature.findFirst({
        where: { name },
      });

      if (existingFeature) {
        return res.status(400).json({
          success: false,
          message: "Nama Fitur sudah ada",
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

      const newFeature = await prisma.vehicleFeature.create({
        data: {
          name,
          vehicleType: {
            connect: { id: typeId },
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Fitur berhasil dibuat",
        data: newFeature,
      });
    } catch (error) {
      console.error("Error dalam createFeature:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengupdate data Features berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updateFeature: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, brandId } = req.body;

      const existingFeature = await prisma.vehicleFeature.findUnique({
        where: { id },
      });

      if (!existingFeature) {
        return res.status(404).json({
          success: false,
          message: "ID Fitur tidak ditemukan",
        });
      }

      const updatedFeature = await prisma.vehicleFeature.update({
        where: { id },
        data: {
          name: name || existingFeature.name,
          typeId: typeId || existingFeature.typeId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil diupdate",
        data: updatedFeature,
      });
    } catch (error) {
      console.error("Error dalam updateFeature:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menghapus data Features berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deleteFeature: async (req, res) => {
    try {
      const { id } = req.params;

      const existingFeature = await prisma.vehicleFeature.findUnique({
        where: { id },
      });

      if (!existingFeature) {
        return res.status(404).json({
          success: false,
          message: "Fitur tidak ditemukan",
        });
      }

      await prisma.vehicleFeature.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil dihapus",
      });
    } catch (error) {
      console.error("Error dalam deleteFeature:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default featureController;
