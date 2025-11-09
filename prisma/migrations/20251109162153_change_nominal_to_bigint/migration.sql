/*
  Warnings:

  - You are about to alter the column `nominal` on the `Target` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Target" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employee_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "nominal" BIGINT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Target_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Target_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Target" ("created_at", "deleted_at", "employee_id", "id", "month", "nominal", "product_id", "updated_at", "year") SELECT "created_at", "deleted_at", "employee_id", "id", "month", "nominal", "product_id", "updated_at", "year" FROM "Target";
DROP TABLE "Target";
ALTER TABLE "new_Target" RENAME TO "Target";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
