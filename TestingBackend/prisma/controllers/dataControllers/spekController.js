import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Specifications
 */
const spekController = {
  /**
   * Mendapatkan semua data Specifications dengan pagination
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllSpecification: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalSpecification = await prisma.vehicleSpecification.count();

      // Ambil data dengan pagination
      const result = await prisma.vehicleSpecification.findMany({
        orderBy: { id: "asc" },
        skip: skipInt,
        take: limitInt,
        select: {
          id: true,
          key: true,
          value: true,
          vehicleModel: {
            select: {
              name: true, // Hanya ambil nama dari vehicleType
            },
          },
        },
      });

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada Data Fitur ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil diambil",
        metadata: {
          total: totalSpecification,
          limit: limitInt,
          skip: skipInt,
        },
        data: result,
      });
    } catch (error) {
      console.error("Error dalam getAllSpecifications:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mendapatkan data Specifications berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getSpecificationById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const result = await prisma.vehicleSpecification.findUnique({
        where: { id },
        select: {
          id: true,
          key: true,
          value: true,
          vehicleModel: {
            select: {
              name: true, // Hanya ambil nama dari vehicleType
            },
          },
        },
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Fitur tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil diambil berdasarkan ID",
        data: spek,
      });
    } catch (error) {
      console.error("Error dalam getSpecificationById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menambahkan data Specifications baru
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createSpecification: async (req, res) => {
    try {
      const { key, value, modelId } = req.body;

      // Validasi Input
      if (!key || !value || !modelId) {
        return res.status(400).json({
          success: false,
          message: "Input Key & Value tidak boleh kosong",
        });
      }

      // Validasi Nama Fitur
      const existingSpecification = await prisma.vehicleSpecification.findFirst(
        {
          where: { key },
        }
      );

      if (existingSpecification) {
        return res.status(400).json({
          success: false,
          message: "Nama Fitur sudah ada",
        });
      }

      // Validasi ID Model
      const existingModel = await prisma.vehicleModel.findFirst({
        where: { id: modelId },
      });

      if (!existingModel) {
        return res.status(400).json({
          success: false,
          message: "ID Model tidak ditemukan",
        });
      }
      const newSpecification = await prisma.vehicleSpecification.create({
        data: {
          key,
          value,
          vehicleModel: { connect: { id: modelId } },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Specification berhasil dibuat",
        data: newSpecification,
      });
    } catch (error) {
      console.error("Error dalam createSpecification:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengupdate data Specifications berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updateSpecification: async (req, res) => {
    try {
      const { id } = req.params;
      const { key, value, modelId } = req.body;

      const existingSpecification =
        await prisma.vehicleSpecification.findUnique({
          where: { id },
        });

      if (!existingSpecification) {
        return res.status(404).json({
          success: false,
          message: "ID Fitur tidak ditemukan",
        });
      }

      const updatedSpecification = await prisma.vehicleSpecification.update({
        where: { id },
        data: {
          key: key || existingSpecification.key,
          value: value || existingSpecification.value,
          vehicleModel: {
            connect: { id: modelId || existingSpecification.modelId },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil diupdate",
        data: updatedSpecification,
      });
    } catch (error) {
      console.error("Error dalam updateSpecification:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menghapus data Specifications berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deleteSpecification: async (req, res) => {
    try {
      const { id } = req.params;

      const existingSpecification =
        await prisma.vehicleSpecification.findUnique({
          where: { id },
        });

      if (!existingSpecification) {
        return res.status(404).json({
          success: false,
          message: "Fitur tidak ditemukan",
        });
      }

      await prisma.vehicleSpecification.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Fitur berhasil dihapus",
      });
    } catch (error) {
      console.error("Error dalam deleteSpecification:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default spekController;
