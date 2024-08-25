import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Models
 */
const modelsController = {
  /**
   * GET all Models
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllModels: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalModels = await prisma.vehicleModel.count();

      // Ambil data dengan pagination
      const result = await prisma.vehicleModel.findMany({
        orderBy: { id: "asc" },
        skip: skipInt,
        take: limitInt,
        select: {
          id: true,
          name: true,
          vehicleType: {
            select: {
              name: true,
              vehicleBrand: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (models.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data models ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Models berhasil diambil",
        metadata: {
          total: totalModels,
          limit: limitInt,
          skip: skipInt,
        },
        data: result,
      });
    } catch (error) {
      console.error("Error dalam getAllModels:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET Model by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getModelById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const model = await prisma.vehicleModel.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          vehicleType: {
            select: {
              name: true,
              vehicleBrand: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!model) {
        return res.status(404).json({
          success: false,
          message: "Model tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Model berhasil diambil berdasarkan ID",
        data: model,
      });
    } catch (error) {
      console.error("Error dalam getModelById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST Create a new Model
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createModel: async (req, res) => {
    try {
      const { name, typeId } = req.body;

      if (!name || !typeId) {
        return res.status(400).json({
          success: false,
          message: "Input Nama & Type tidak boleh kosong",
        });
      }

      // Validasi Nama Model
      const existingModel = await prisma.vehicleModel.findFirst({
        where: { name, typeId },
      });

      if (existingModel) {
        return res.status(400).json({
          success: false,
          message: "Nama Model sudah ada",
        });
      }

      // Validasi ID Tipe
      const existingType = await prisma.vehicleType.findUnique({
        where: { id: typeId },
      });

      if (!existingType) {
        return res.status(400).json({
          success: false,
          message: "ID Tipe tidak ditemukan",
        });
      }

      const model = await prisma.vehicleModel.create({
        data: {
          name,
          vehicleType: {
            connect: { id: typeId },
          },
        },
      });
      return res.status(201).json({
        success: true,
        message: "Model berhasil dibuat",
        data: model,
      });
    } catch (error) {
      console.error("Error dalam createModel:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PATCH Update a Model
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updateModel: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, typeId } = req.body;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid",
        });
      }

      const model = await prisma.vehicleModel.findUnique({
        where: { id },
      });

      if (!model) {
        return res.status(404).json({
          success: false,
          message: "Model tidak ditemukan",
        });
      }

      if (typeId) {
        const typeExists = await prisma.vehicleType.findUnique({
          where: { id: typeId },
        });

        if (!typeExists) {
          return res.status(400).json({
            success: false,
            message: "Type tidak ditemukan",
          });
        }
      }

      const updatedModel = await prisma.vehicleModel.update({
        where: { id },
        data: {
          name: name || model.name,
          vehicleType: typeId ? { connect: { id: typeId } } : undefined,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Model berhasil diupdate",
        data: updatedModel,
      });
    } catch (error) {
      console.error("Error dalam updateModel:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * DELETE a Model
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deleteModel: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid",
        });
      }

      const model = await prisma.vehicleModel.findUnique({
        where: { id },
      });

      if (!model) {
        return res.status(404).json({
          success: false,
          message: "Model tidak ditemukan",
        });
      }

      // Validasi relasi antara Model dan Price
      // const relatedPrice = await prisma.priceList.findMany({
      //   where: { modelId: id },
      // });

      // if (relatedPrice.length > 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message:
      //       "Tidak bisa menghapus Model karena masih ada PriceList terkait",
      //   });
      // }

      await prisma.vehicleModel.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Model berhasil dihapus",
      });
    } catch (error) {
      console.error("Error dalam deleteModel:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default modelsController;
