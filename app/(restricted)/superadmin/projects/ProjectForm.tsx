"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectStatus, Department, Employee } from "@prisma/client";
import { projectSchema, type ProjectFormData } from "@/app/schemas/project";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/MultiSelect";

interface ProjectFormProps {
    initialData?: ProjectFormData;
    onClose: () => void;
    onSuccess: () => void;
    departments: Department[];
    employees: Employee[];
}

export function ProjectForm({ initialData, onClose, onSuccess, departments, employees }: ProjectFormProps) {
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            id: initialData?.id,
            name: initialData?.name || "",
            departmentId: initialData?.departmentId || "",
            assignedToId: initialData?.assignedToId || "",
            members: initialData?.members || [],
            status: initialData?.status || ProjectStatus.PENDING,
            startDate: initialData?.startDate || new Date(),
            endDate: initialData?.endDate || new Date(),
        },
    });

    useEffect(() => {
        const selectedDeptId = form.watch('departmentId');
        if (selectedDeptId) {
            // @ts-expect-error employees is not included in the response
            const deptEmployees = departments.find(dept => dept.id === selectedDeptId)?.employees;
            setFilteredEmployees(deptEmployees);
        } else {
            setFilteredEmployees([]);
        }
    }, [departments, form]);


    const updateProject = async (data: ProjectFormData) => {
        const response = await fetch(`/api/project`, {
            method: "PUT",
            body: JSON.stringify(data),
        });

        if (response.ok) {
            onSuccess();
        }
    }

    const createProject = async (data: ProjectFormData) => {
        const response = await fetch(`/api/project`, {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (response.ok) {
            onSuccess();
        }
    }

    const onSubmit = async (data: ProjectFormData) => {
        if (data.id) {
            await updateProject(data);
        } else {
            await createProject(data);
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
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </FormItem>

                    )}
                />

                <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormItem>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </FormItem>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="assignedToId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assigned To</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || undefined}
                                    disabled={!form.watch('departmentId')}
                                >
                                    <FormItem>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Employee" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {filteredEmployees.map((emp) => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {
                                                        // @ts-expect-error user is not included in the response
                                                        emp?.user?.name
                                                    }
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </FormItem>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Members</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={filteredEmployees.map((emp) => ({
                                        // @ts-expect-error user is not included in the response
                                        label: emp.user?.name,
                                        value: emp.id,
                                    }))}
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select members..."
                                />
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
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormItem>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {Object.values(ProjectStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.replace("_", " ")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </FormItem>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    {...field}
                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value ? new Date(e.target.value) : null)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    {...field}
                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value ? new Date(e.target.value) : null)
                                    }}
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
                        {initialData ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}