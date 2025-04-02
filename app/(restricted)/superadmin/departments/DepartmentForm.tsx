"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { departmentSchema, type DepartmentFormData } from "@/schemas/department";
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
import { MultiSelect } from "@/components/MultiSelect";

interface Employee {
    id: string;
    name: string;
}

interface Project {
    id: string;
    name: string;
}

interface DepartmentFormProps {
    department?: DepartmentFormData | null;
    onClose: () => void;
    onSuccess: () => void;
    employees?: Employee[];
    projects?: Project[];
}

export function DepartmentForm({ department, onClose, onSuccess, employees, projects }: DepartmentFormProps) {
    const form = useForm<DepartmentFormData>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            id: department?.id || undefined,
            name: department?.name || "",
            // @ts-expect-error employee is not always present
            employees: department?.employees?.map((emp) => emp.id) || [],
            // @ts-expect-error project is not always present
            projects: department?.projects?.map((proj) => proj.id) || [],
        },
    });



    const onSubmit = async (data: DepartmentFormData) => {
        try {
            if (department?.id) {
                await fetch(`/api/department`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                });
                toast.success("Department updated successfully");
                onSuccess();
            } else {
                await fetch("/api/department", {
                    method: "POST",
                    body: JSON.stringify(data),
                });
                toast.success("Department created successfully");
                onSuccess();
            }
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save department");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="employees"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employees</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={employees?.map(emp => ({
                                        // @ts-expect-error employee is not always present
                                        value: emp.employee.id,
                                        label: emp.name
                                    })) || []}
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select employees..."
                                    error={!!form.formState.errors.employees}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="projects"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Projects</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={projects?.map(proj => ({
                                        value: proj.id,
                                        label: proj.name
                                    })) || []}
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select projects..."
                                    error={!!form.formState.errors.projects}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {department ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}