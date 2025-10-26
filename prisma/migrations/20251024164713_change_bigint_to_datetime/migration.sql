/*
  Warnings:

  - You are about to alter the column `created_at` on the `Achievement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `updated_at` on the `Achievement` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `created_at` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `updated_at` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `created_at` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `updated_at` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `created_at` on the `Target` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `updated_at` on the `Target` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `created_at` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.
  - You are about to alter the column `entry_date` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `updated_at` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_id" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Achievement_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "Target" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Achievement" ("created_at", "id", "nominal", "target_id", "updated_at") SELECT "created_at", "id", "nominal", "target_id", "updated_at" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
CREATE UNIQUE INDEX "Achievement_target_id_key" ON "Achievement"("target_id");
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Category" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("category_id", "created_at", "id", "name", "updated_at") SELECT "category_id", "created_at", "id", "name", "updated_at" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Target" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employee_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "productId" TEXT,
    CONSTRAINT "Target_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Target_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Target" ("created_at", "date", "employee_id", "id", "nominal", "productId", "product_id", "updated_at") SELECT "created_at", "date", "employee_id", "id", "nominal", "productId", "product_id", "updated_at" FROM "Target";
DROP TABLE "Target";
ALTER TABLE "new_Target" RENAME TO "Target";
CREATE INDEX "Target_employee_id_idx" ON "Target"("employee_id");
CREATE INDEX "Target_product_id_idx" ON "Target"("product_id");
CREATE TABLE "new_employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "offile_location" TEXT NOT NULL,
    "entry_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_employees" ("created_at", "entry_date", "id", "name", "offile_location", "position", "updated_at") SELECT "created_at", "entry_date", "id", "name", "offile_location", "position", "updated_at" FROM "employees";
DROP TABLE "employees";
ALTER TABLE "new_employees" RENAME TO "employees";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
