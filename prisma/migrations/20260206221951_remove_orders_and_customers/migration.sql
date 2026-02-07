/*
  Warnings:

  - You are about to drop the column `comparePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "comparePrice",
DROP COLUMN "imageUrl",
ADD COLUMN     "compareAtPrice" DOUBLE PRECISION,
ADD COLUMN     "images" TEXT[];

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");
