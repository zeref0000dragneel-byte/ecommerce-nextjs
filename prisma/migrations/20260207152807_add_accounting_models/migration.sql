-- CreateEnum
CREATE TYPE "AccountingSaleStatus" AS ENUM ('pagado', 'parcial', 'pendiente');

-- CreateTable
CREATE TABLE "AccountingExternalItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingExternalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingExpense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingSale" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "externalItemId" TEXT,
    "quantity" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "AccountingSaleStatus" NOT NULL DEFAULT 'pagado',
    "clientName" TEXT,
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingSale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingSale_productId_idx" ON "AccountingSale"("productId");

-- CreateIndex
CREATE INDEX "AccountingSale_externalItemId_idx" ON "AccountingSale"("externalItemId");

-- CreateIndex
CREATE INDEX "AccountingSale_status_idx" ON "AccountingSale"("status");

-- AddForeignKey
ALTER TABLE "AccountingSale" ADD CONSTRAINT "AccountingSale_externalItemId_fkey" FOREIGN KEY ("externalItemId") REFERENCES "AccountingExternalItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
