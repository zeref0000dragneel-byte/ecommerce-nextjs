import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configuración de Prisma con logs en desarrollo
const prismaOptions = {
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaOptions);

// En desarrollo, guardar la instancia en global para hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Log de conexión en desarrollo
if (process.env.NODE_ENV === "development") {
  prisma.$connect().then(() => {
    console.log("✅ Prisma Client conectado correctamente");
  }).catch((error) => {
    console.error("❌ Error al conectar Prisma Client:", error);
    console.error("💡 Verifica tu DATABASE_URL y DIRECT_URL en .env");
  });
}

export default prisma;