import { z } from "zod";

export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Department name must be at least 2 characters"),
  employees: z.array(z.string()).optional(),
  projects: z.array(z.string()).optional(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

import { ProjectStatus } from "@prisma/client";

export const projectSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Project name is required"),
    departmentId: z.string().min(1, "Department is required"),
    assignedToId: z.string().optional().nullable(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type ProjectFormData = z.infer<typeof projectSchema>;
