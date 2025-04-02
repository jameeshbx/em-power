import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(Object.values(TaskStatus) as [string, ...string[]], {
    required_error: "Please select a status",
  }),
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
