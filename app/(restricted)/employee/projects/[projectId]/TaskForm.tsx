"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { taskSchema, type TaskFormData } from "@/schemas/task";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";

interface Employee {
    id: string;
    name: string;
}

interface TaskFormProps {
    task?: TaskFormData | null;
    onClose: () => void;
    onSuccess: () => void;
    employees?: Employee[];
    project?: {
        id: string;
        name: string;
    };
}

export function TaskForm({ task, onClose, onSuccess, employees, project }: TaskFormProps) {
    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            id: task?.id || undefined,
            title: task?.title || "",
            description: task?.description || "",
            status: task?.status || "",
            projectId: task?.projectId || project?.id,
            assigneeId: task?.assigneeId || "",
        },
    });



    const onSubmit = async (data: TaskFormData) => {
        try {
            if (task?.id) {
                await fetch(`/api/task`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                });
                toast.success("Task updated successfully");
                onSuccess();
            } else {
                await fetch("/api/task", {
                    method: "POST",
                    body: JSON.stringify(data),
                });
                toast.success("Task created successfully");
                onSuccess();
            }
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save task");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task Description</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task Status</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value || ""}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent className="min-w-0 bg-white w-full">
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="QA">QA</SelectItem>
                                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assignee</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value || ""}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select an assignee" />
                                    </SelectTrigger>
                                    <SelectContent className="min-w-0 bg-white w-full">
                                        {employees?.map(employee => (
                                            <SelectItem key={employee.id} value={employee.id}>
                                                {employee.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {task ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}