-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assigneeId" TEXT;

-- CreateTable
CREATE TABLE "_EmployeeProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EmployeeProjects_B_index" ON "_EmployeeProjects"("B");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeProjects" ADD CONSTRAINT "_EmployeeProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeProjects" ADD CONSTRAINT "_EmployeeProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
