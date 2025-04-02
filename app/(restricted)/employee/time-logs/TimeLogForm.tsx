'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimeLog, Task, User } from '@prisma/client';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { timeLogSchema, type TimeLogFormData } from '@/schemas/timeLog';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimeLogFormProps {
    log?: TimeLog | null;
    tasks?: Partial<Task>[] | null;
    onClose: () => void;
    onSuccess: () => void;
}

const parseDate = (date: Date | string | null | undefined): Date | null => {
    if (!date) return null;
    try {
        if (typeof date === 'string' && date.includes('/')) {
            // Handle DD/MM/YYYY, HH:mm:ss format
            const [datePart, timePart] = date.split(', ');
            const [day, month, year] = datePart.split('/');
            const [hours, minutes, seconds] = timePart.split(':');

            // Month is 0-based in JavaScript Date
            return new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes),
                parseInt(seconds)
            );
        }
        return new Date(date);
    } catch (e) {
        console.error('Date parsing error:', e);
        return new Date();
    }
};

export default function TimeLogForm({ log, tasks, onClose, onSuccess }: TimeLogFormProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const user = useUser();

    useEffect(() => {
        const setUser = async () => {
            if (user) {
                const resolvedUser = await user;
                setCurrentUser(resolvedUser);
            }
        };
        setUser();
    }, [user]);

    const form = useForm<TimeLogFormData>({
        resolver: zodResolver(timeLogSchema),
        defaultValues: {
            id: log?.id,
            taskId: log?.taskId || '',
            employeeId: log?.employeeId || '',
            startTime: log?.startTime ? parseDate(log.startTime) || new Date() : new Date(),
            endTime: log?.endTime ? parseDate(log.endTime) || new Date() : new Date(),
            duration: log?.duration || 0,
            notes: log?.notes || '',
        },
    });
    const onSubmit = async (data: TimeLogFormData) => {
        const formattedData = {
            ...data,
            // @ts-expect-error employee is not included in the user object
            employeeId: currentUser?.employee?.id,
        }
        if (log?.id) {
            await fetch(`/api/time-logs`, {
                method: "PUT",
                body: JSON.stringify(formattedData),
            });
            toast.success("Time log updated successfully");
            onSuccess();
        } else {
            await fetch(`/api/time-logs`, {
                method: "POST",
                body: JSON.stringify(formattedData),
            });
            toast.success("Time log created successfully");
            onSuccess();
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>


                    <FormField
                        control={form.control}
                        name="taskId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Task</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value || ""}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a task" />
                                        </SelectTrigger>
                                        <SelectContent className="min-w-0 bg-white w-full">
                                            {tasks?.map(task => (
                                                <SelectItem key={task.id || ''} value={task.id || ''}>
                                                    {task.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        selected={field.value}
                                        onChange={(date: Date | null) => {
                                            if (!date) return;
                                            field.onChange(date);
                                            // Calculate duration
                                            const endDate = form.getValues("endTime");
                                            if (date && endDate) {
                                                const diffMs = endDate.getTime() - date.getTime();
                                                // Convert milliseconds directly to minutes
                                                const durationInMinutes = Math.round(diffMs / (1000 * 60));
                                                form.setValue("duration", durationInMinutes);
                                            }
                                        }}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={5}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    />
                                </FormControl>
                                {form.formState.errors.startTime && (
                                    <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>
                                )}
                            </FormItem>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        selected={field.value}
                                        onChange={(date: Date | null) => {
                                            if (!date) return;
                                            field.onChange(date);
                                            // Calculate duration
                                            const startDate = form.getValues("startTime");
                                            if (startDate && date) {
                                                const diffMs = date.getTime() - startDate.getTime();
                                                // Convert milliseconds directly to minutes
                                                const durationInMinutes = Math.round(diffMs / (1000 * 60));
                                                form.setValue("duration", durationInMinutes);
                                            }
                                        }}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={5}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    />
                                </FormControl>
                                {form.formState.errors.endTime && (
                                    <p className="text-sm text-red-500">{form.formState.errors.endTime.message}</p>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />


                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {log ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}