-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ON_HOLD', 'CANCELLED', 'QA', 'BLOCKED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PasswordType" AS ENUM ('PRIVATE', 'PUBLIC', 'RESTRICTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "reportingToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "approvedById" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeLog" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "PasswordType" NOT NULL DEFAULT 'PRIVATE',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordShare" (
    "id" TEXT NOT NULL,
    "passwordId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmployeeDepartments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeDepartments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "Employee_userId_idx" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "Employee_reportingToId_idx" ON "Employee"("reportingToId");

-- CreateIndex
CREATE INDEX "Employee_joiningDate_idx" ON "Employee"("joiningDate");

-- CreateIndex
CREATE INDEX "Employee_designation_idx" ON "Employee"("designation");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Department_name_idx" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Project_departmentId_idx" ON "Project"("departmentId");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_createdAt_idx" ON "Task"("createdAt");

-- CreateIndex
CREATE INDEX "Task_title_idx" ON "Task"("title");

-- CreateIndex
CREATE INDEX "Leave_employeeId_idx" ON "Leave"("employeeId");

-- CreateIndex
CREATE INDEX "Leave_startDate_idx" ON "Leave"("startDate");

-- CreateIndex
CREATE INDEX "Leave_endDate_idx" ON "Leave"("endDate");

-- CreateIndex
CREATE INDEX "Leave_status_idx" ON "Leave"("status");

-- CreateIndex
CREATE INDEX "TimeLog_employeeId_idx" ON "TimeLog"("employeeId");

-- CreateIndex
CREATE INDEX "TimeLog_taskId_idx" ON "TimeLog"("taskId");

-- CreateIndex
CREATE INDEX "TimeLog_startTime_idx" ON "TimeLog"("startTime");

-- CreateIndex
CREATE INDEX "TimeLog_endTime_idx" ON "TimeLog"("endTime");

-- CreateIndex
CREATE INDEX "TimeLog_duration_idx" ON "TimeLog"("duration");

-- CreateIndex
CREATE INDEX "Password_ownerId_idx" ON "Password"("ownerId");

-- CreateIndex
CREATE INDEX "Password_type_idx" ON "Password"("type");

-- CreateIndex
CREATE INDEX "Password_name_idx" ON "Password"("name");

-- CreateIndex
CREATE INDEX "PasswordShare_passwordId_idx" ON "PasswordShare"("passwordId");

-- CreateIndex
CREATE INDEX "PasswordShare_employeeId_idx" ON "PasswordShare"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordShare_passwordId_employeeId_key" ON "PasswordShare"("passwordId", "employeeId");

-- CreateIndex
CREATE INDEX "_EmployeeDepartments_B_index" ON "_EmployeeDepartments"("B");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_reportingToId_fkey" FOREIGN KEY ("reportingToId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordShare" ADD CONSTRAINT "PasswordShare_passwordId_fkey" FOREIGN KEY ("passwordId") REFERENCES "Password"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordShare" ADD CONSTRAINT "PasswordShare_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeDepartments" ADD CONSTRAINT "_EmployeeDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeDepartments" ADD CONSTRAINT "_EmployeeDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
