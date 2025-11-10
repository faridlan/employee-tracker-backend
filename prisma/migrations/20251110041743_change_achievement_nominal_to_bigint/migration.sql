/*
  Warnings:

  - You are about to alter the column `nominal` on the `Achievement` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_id" TEXT NOT NULL,
    "nominal" BIGINT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Achievement_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "Target" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Achievement" ("created_at", "id", "nominal", "target_id", "updated_at") SELECT "created_at", "id", "nominal", "target_id", "updated_at" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
CREATE UNIQUE INDEX "Achievement_target_id_key" ON "Achievement"("target_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
