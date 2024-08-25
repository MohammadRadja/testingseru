import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Types
 */
const typesController = {
  /**
   * Mendapatkan semua data Types dengan pagination
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllTypes: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalTypes = await prisma.vehicleType.count();

      // Ambil data dengan pagination
      const result = await prisma.vehicleType.findMany({
        orderBy: { id: "asc" },
        skip: skipInt,
        take: limitInt,
        select: {
          id: true,
          name: true,
          vehicleBrand: {
            select: {
              name: true, // Hanya ambil nama dari vehicleBrand
            },
          },
        },
      });

      if (types.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data types ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Types berhasil diambil",
        metadata: {
          total: totalTypes,
          limit: limitInt,
          skip: skipInt,
        },
        data: result,
      });
    } catch (error) {
      console.error("Error dalam getAllTypes:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mendapatkan data Types berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getTypeById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const type = await prisma.vehicleType.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          vehicleBrand: {
            select: {
              name: true, // Ambil nama dari vehicleBrand
            },
          },
        },
      });

      if (!type) {
        return res.status(404).json({
          success: false,
          message: "Type tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Type berhasil diambil berdasarkan ID",
        data: type,
      });
    } catch (error) {
      console.error("Error dalam getTypeById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menambahkan data Types baru
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createType: async (req, res) => {
    try {
      const { name, brandId } = req.body;

      // Validasi Input
      if (!name || !brandId) {
        return res.status(400).json({
          success: false,
          message: "Input Nama & Brand tidak boleh kosong",
        });
      }

      // Validasi Nama Tipe
      const existingType = await prisma.vehicleType.findFirst({
        where: { name },
      });

      if (existingType) {
        return res.status(400).json({
          success: false,
          message: "Nama Types sudah ada",
        });
      }

      // Validasi ID Brand
      const existingBrand = await prisma.vehicleBrand.findFirst({
        where: { id: brandId },
      });

      if (!existingBrand) {
        return res.status(400).json({
          success: false,
          message: "ID Brand tidak ditemukan",
        });
      }
      const newType = await prisma.vehicleType.create({
        data: {
          name,
          vehicleBrand: { connect: { id: brandId } },
        },
      });

      return res.status(201).json({
        success: true,
        message: "Type berhasil dibuat",
        data: newType,
      });
    } catch (error) {
      console.error("Error dalam createType:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Mengupdate data Types berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updateType: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, brandId } = req.body;

      const existingType = await prisma.vehicleType.findUnique({
        where: { id },
      });

      if (!existingType) {
        return res.status(404).json({
          success: false,
          message: "Type tidak ditemukan",
        });
      }

      const updatedType = await prisma.vehicleType.update({
        where: { id },
        data: {
          name: name || existingType.name,
          brandId: brandId || existingType.brandId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Type berhasil diupdate",
        data: updatedType,
      });
    } catch (error) {
      console.error("Error dalam updateType:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Menghapus data Types berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deleteType: async (req, res) => {
    try {
      const { id } = req.params;

      const existingType = await prisma.vehicleType.findUnique({
        where: { id },
      });

      if (!existingType) {
        return res.status(404).json({
          success: false,
          message: "Type tidak ditemukan",
        });
      }

      // Validasi relasi antara Type dan Model
      // const relatedModels = await prisma.vehicleModel.findMany({
      //   where: { typeId: id },
      // });

      // if (relatedModels.length > 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Tidak bisa menghapus Type karena masih ada Model terkait",
      //   });
      // }

      await prisma.vehicleType.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Type berhasil dihapus, termasuk pada Model terkait",
      });
    } catch (error) {
      console.error("Error dalam deleteType:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default typesController;
