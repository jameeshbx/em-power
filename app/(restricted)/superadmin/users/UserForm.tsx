"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";
const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(["SUPERADMIN", "ADMIN", "MANAGER", "EMPLOYEE"], {
        required_error: "Role is required",
    }),
    reportingToId: z.string().optional(),
    availableLeaves: z.number().min(0, "Available leaves must be at least 0"),
    designation: z.string().optional(),
    joiningDate: z.date().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
    user?: UserFormData | null;
    onClose: () => void;
    onSuccess: () => void;
    managers: User[];
}

export function UserForm({ user, onClose, onSuccess, managers }: UserFormProps) {
    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: user || {
            id: undefined,
            name: "",
            email: "",
            password: "",
            role: "EMPLOYEE",
            reportingToId: undefined,
            availableLeaves: 25,
            designation: "",
            joiningDate: new Date(),
        },
    });

    const onSubmit = async (data: UserFormData) => {
        try {
            if (user?.id) {
                await fetch(`/api/user`, {
                    method: "PUT",
                    body: JSON.stringify(data),
                });

                toast.success("User updated successfully");
                onSuccess();
            } else {
                await fetch("/api/user", {
                    method: "POST",
                    body: JSON.stringify(data),
                });

                toast.success("User created successfully");
                onSuccess();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save user");
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-full">
                                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="joiningDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Joining Date</FormLabel>
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
                    name="reportingToId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reporting To</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value || ""}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a reporting to" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectItem value="none">None</SelectItem>
                                        {managers.length > 0 && managers.map((manager) => (
                                            <SelectItem key={manager.id} value={
                                                // @ts-expect-error manager is not always present
                                                manager.manager?.id
                                            }>
                                                {manager.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="availableLeaves"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Available Leaves</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    value={field.value}
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
                        {user ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 