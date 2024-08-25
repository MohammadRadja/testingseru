import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller untuk mengelola Price
 */
const priceController = {
  /**
   * GET all Prices
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getAllPrices: async (req, res) => {
    try {
      // Ambil parameter query untuk pagination
      const { limit = 10, skip = 0 } = req.query;

      // Konversi ke integer jika perlu
      const limitInt = parseInt(limit, 10);
      const skipInt = parseInt(skip, 10);

      // Hitung total jumlah data
      const totalPrices = await prisma.priceList.count();

      // Ambil data dengan pagination
      const prices = await prisma.priceList.findMany({
        orderBy: { id: "asc" },
        skip: skipInt,
        take: limitInt,
        select: {
          id: true,
          vehicleYear: {
            select: {
              year: true, // Nama tahun
            },
          },
          vehicleModel: {
            select: {
              name: true, // Nama model
            },
          },
          vehicleCategory: {
            select: {
              name: true, // Nama kategori kendaraan
            },
          },
          vehicleFeature: {
            select: {
              name: true, // Nama fitur kendaraan
            },
          },
          vehicleSpecification: {
            select: {
              key: true, // Kunci spesifikasi
              value: true, // Nilai spesifikasi
            },
          },
        },
      });

      if (prices.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Tidak ada data harga ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Harga berhasil diambil",
        metadata: {
          total: totalPrices,
          limit: limitInt,
          skip: skipInt,
        },
        data: prices,
      });
    } catch (error) {
      console.error("Error dalam getAllPrices:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET Price by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getPriceById: async (req, res) => {
    try {
      const { id } = req.params;

      //Validasi ID
      if (typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid, harus berupa string yang tidak kosong",
        });
      }

      const price = await prisma.priceList.findUnique({
        where: { id },
        select: {
          id: true,
          vehicleYear: {
            select: {
              year: true, // Nama tahun
            },
          },
          vehicleModel: {
            select: {
              name: true, // Nama model
            },
          },
          vehicleCategory: {
            select: {
              name: true, // Nama kategori kendaraan
            },
          },
          vehicleFeature: {
            select: {
              name: true, // Nama fitur kendaraan
            },
          },
          vehicleSpecification: {
            select: {
              key: true, // Kunci spesifikasi
              value: true, // Nilai spesifikasi
            },
          },
        },
      });

      if (!price) {
        return res.status(404).json({
          success: false,
          message: "ID Harga tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Harga berhasil diambil berdasarkan ID",
        data: price,
      });
    } catch (error) {
      console.error("Error dalam getPriceById:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST Create a new Price
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  createPrice: async (req, res) => {
    try {
      const { yearId, modelId, categoryId, featureId, spekId } = req.body;

      if (!yearId || !modelId || !categoryId || !featureId || !spekId) {
        return res.status(400).json({
          success: false,
          message:
            "Input Year, Model, Category, Feature, dan Spek tidak boleh kosong",
        });
      }

      const existingYear = await prisma.vehicleYear.findUnique({
        where: { id: yearId },
      });

      const existingModel = await prisma.vehicleModel.findUnique({
        where: { id: modelId },
      });

      const existingCategory = await prisma.vehicleCategory.findUnique({
        where: { id: categoryId },
      });

      const existingFeature = await prisma.vehicleFeature.findUnique({
        where: { id: featureId },
      });

      const existingSpec = await prisma.vehicleSpecification.findUnique({
        where: { id: spekId },
      });

      if (
        !existingYear ||
        !existingModel ||
        !existingCategory ||
        !existingFeature ||
        !existingSpec
      ) {
        return res.status(400).json({
          success: false,
          message:
            "ID Tahun, Model, Kategory, Fitur, atau Spek tidak ditemukan",
        });
      }

      const price = await prisma.priceList.create({
        data: {
          yearId,
          modelId,
          categoryId,
          featureId,
          spekId,
        },
      });
      return res.status(201).json({
        success: true,
        message: "Harga berhasil dibuat",
        data: price,
      });
    } catch (error) {
      console.error("Error dalam createPrice:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PATCH Update a Price
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  updatePrice: async (req, res) => {
    try {
      const { id } = req.params;
      const { yearId, modelId, categoryId, featureId, spekId } = req.body;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid",
        });
      }

      const price = await prisma.priceList.findUnique({
        where: { id },
      });

      if (!price) {
        return res.status(404).json({
          success: false,
          message: "Harga tidak ditemukan",
        });
      }

      if (yearId) {
        const yearExists = await prisma.vehicleYear.findUnique({
          where: { id: yearId },
        });

        if (!yearExists) {
          return res.status(404).json({
            success: false,
            message: "Year tidak ditemukan",
          });
        }
      }

      if (modelId) {
        const modelExists = await prisma.vehicleModel.findUnique({
          where: { id: modelId },
        });

        if (!modelExists) {
          return res.status(404).json({
            success: false,
            message: "Model tidak ditemukan",
          });
        }
      }

      if (categoryId) {
        const categoryExists = await prisma.vehicleCategory.findUnique({
          where: { id: categoryId },
        });

        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: "Category tidak ditemukan",
          });
        }
      }

      if (featureId) {
        const featureExists = await prisma.vehicleFeature.findUnique({
          where: { id: featureId },
        });

        if (!featureExists) {
          return res.status(404).json({
            success: false,
            message: "Feature tidak ditemukan",
          });
        }
      }

      if (spekId) {
        const specExists = await prisma.vehicleSpecification.findUnique({
          where: { id: spekId },
        });

        if (!specExists) {
          return res.status(404).json({
            success: false,
            message: "Specification tidak ditemukan",
          });
        }
      }

      const updatedPrice = await prisma.priceList.update({
        where: { id },
        data: {
          yearId: yearId || price.yearId,
          modelId: modelId || price.modelId,
          categoryId: categoryId || price.categoryId,
          featureId: featureId || price.featureId,
          spekId: spekId || price.spekId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Harga berhasil diperbarui",
        data: updatedPrice,
      });
    } catch (error) {
      console.error("Error dalam updatePrice:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * DELETE Price by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  deletePrice: async (req, res) => {
    try {
      const { id } = req.params;

      const price = await prisma.priceList.findUnique({
        where: { id },
      });

      if (!price) {
        return res.status(404).json({
          success: false,
          message: "Harga tidak ditemukan",
        });
      }

      await prisma.priceList.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Harga berhasil dihapus",
      });
    } catch (error) {
      console.error("Error dalam deletePrice:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default priceController;
