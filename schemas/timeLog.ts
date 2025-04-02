import { z } from "zod";
import { TimeLog } from "@prisma/client";

export const timeLogSchema = z
  .object({
    id: z.string().optional(),
    employeeId: z.string(),
    taskId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    duration: z.number(),
    notes: z.string(),
  })
  .refine(
    (data) => {
      return data.startTime < data.endTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type TimeLogFormData = z.infer<typeof timeLogSchema>;
