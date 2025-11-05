-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Product_name_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "deleted_at" DATETIME;
ALTER TABLE "Category" ADD COLUMN "name_norm" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "name_norm" TEXT;
