import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

export const projectSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Project name is required"),
    departmentId: z.string().min(1, "Department is required"),
    assignedToId: z.string().optional().nullable(),
    members: z.array(z.string()).optional().nullable(),
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
