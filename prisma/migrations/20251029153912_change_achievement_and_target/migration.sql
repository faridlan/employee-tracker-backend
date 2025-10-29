/*
  Warnings:

  - You are about to drop the column `date` on the `Target` table. All the data in the column will be lost.
  - Added the required column `month` to the `Target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Target" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employee_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Target_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Target_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Target" ("created_at", "employee_id", "id", "nominal", "product_id", "updated_at") SELECT "created_at", "employee_id", "id", "nominal", "product_id", "updated_at" FROM "Target";
DROP TABLE "Target";
ALTER TABLE "new_Target" RENAME TO "Target";
CREATE INDEX "Target_employee_id_idx" ON "Target"("employee_id");
CREATE INDEX "Target_product_id_idx" ON "Target"("product_id");
CREATE UNIQUE INDEX "Target_employee_id_month_year_key" ON "Target"("employee_id", "month", "year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
