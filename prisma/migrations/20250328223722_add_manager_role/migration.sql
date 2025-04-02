-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_managerId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_reportingToId_fkey";

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_reportingToId_fkey" FOREIGN KEY ("reportingToId") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
