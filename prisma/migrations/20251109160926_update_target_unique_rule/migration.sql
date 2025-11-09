/*
  Warnings:

  - A unique constraint covering the columns `[employee_id,product_id,month,year]` on the table `Target` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Target_employee_id_month_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "Target_employee_id_product_id_month_year_key" ON "Target"("employee_id", "product_id", "month", "year");
