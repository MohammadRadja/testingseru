import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function seed() {
  const admin = await bcrypt.hash("Admin123", 10);
  const test = await bcrypt.hash("Test123", 10);

  // Seed data untuk tabel User
  await prisma.user.createMany({
    data: [
      {
        id: uuidv4(),
        username: "Admin",
        password: admin,
        jabatan: "admin",
      },
      {
        id: uuidv4(),
        username: "Test",
        password: test,
        jabatan: "user",
      },
    ],
  });

  console.log("Seeding Data Master Selesai");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
