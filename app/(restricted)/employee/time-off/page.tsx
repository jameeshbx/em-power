'use client'

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "@/lib/date-time";

// Define the validation schema
const timeOffSchema = z.object({
    id: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    leaveType: z.enum(["Vacation", "Sick Leave", "Personal Leave", "Other"], {
        errorMap: () => ({ message: "Please select a leave type" }),
    }),
    status: z.enum(["Pending", "Approved", "Rejected"], {
        errorMap: () => ({ message: "Please select a status" }),
    }).optional(),
    reason: z.string()
        .min(1, "Reason is required")
        .min(10, "Reason must be at least 10 characters")
        .max(500, "Reason must not exceed 500 characters"),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
}, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
});

// Define type for our form data
type TimeOffFormData = z.infer<typeof timeOffSchema>;

export default function Page() {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [workingDays, setWorkingDays] = useState(0);
    const [timeOffs, setTimeOffs] = useState<TimeOffFormData[]>([]);
    const [key, setKey] = useState(0);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm<TimeOffFormData>({
        resolver: zodResolver(timeOffSchema),
    });

    const startDate = watch("startDate");
    const endDate = watch("endDate");

    const calculateWorkingDays = (start: string, end: string) => {
        if (!start || !end) return;

        const startDateTime = new Date(start);
        const endDateTime = new Date(end);
        let days = 0;

        const isSecondSaturday = (date: Date) => {
            // Get the first day of the month
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            // Count Saturdays until we reach current date
            let saturdayCount = 0;
            const current = new Date(firstDay);
            while (current <= date) {
                if (current.getDay() === 6) { // 6 represents Saturday
                    saturdayCount++;
                    if (saturdayCount === 2 &&
                        current.getDate() === date.getDate()) {
                        return true;
                    }
                }
                current.setDate(current.getDate() + 1);
            }
            return false;
        };

        const current = new Date(startDateTime);
        while (current <= endDateTime) {
            // Skip Sundays (0) and second Saturdays
            if (current.getDay() !== 0 && !isSecondSaturday(current)) {
                days++;
            }
            current.setDate(current.getDate() + 1);
        }
        setWorkingDays(days);
    };

    const onSubmit = async (data: TimeOffFormData) => {
        console.log("Form submitted:", data);

        const timeOff = await fetch("/api/timeoff", {
            method: "POST",
            body: JSON.stringify({ ...data, workingDays, startDate: new Date(data.startDate), endDate: new Date(data.endDate) }),
        });

        setShowRequestForm(false);
        setKey(key + 1);
    };

    useEffect(() => {
        const fetchTimeOff = async () => {
            const timeOff = await fetch("/api/timeoff");
            const data = await timeOff.json();
            setTimeOffs(data);
        };
        fetchTimeOff();
    }, [key]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Time off</h1>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => { setShowRequestForm(!showRequestForm) }}>
                    Request Time Off
                </button>
            </div>

            {/* Leave Request Form */}
            {showRequestForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Request Time Off</h2>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className={`w-full border rounded-md p-2 ${errors.startDate ? 'border-red-500' : ''}`}
                                    {...register("startDate")}
                                    onChange={(e) => {
                                        setValue("startDate", e.target.value);
                                        if (endDate) {
                                            calculateWorkingDays(e.target.value, endDate);
                                        }
                                    }}
                                />
                                {errors.startDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    type="date"
                                    className={`w-full border rounded-md p-2 ${errors.endDate ? 'border-red-500' : ''}`}
                                    {...register("endDate")}
                                    min={startDate}
                                    disabled={!startDate}
                                    onChange={(e) => {
                                        setValue("endDate", e.target.value);
                                        if (startDate) {
                                            calculateWorkingDays(startDate, e.target.value);
                                        }
                                    }}
                                />
                                {errors.endDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        {workingDays > 0 && (
                            <div className="text-sm text-gray-600">
                                Number of working days (excluding Sundays and second Saturdays): {workingDays}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Leave Type</label>
                            <select
                                className={`w-full border rounded-md p-2 ${errors.leaveType ? 'border-red-500' : ''}`}
                                {...register("leaveType")}
                            >
                                <option value="">Select leave type</option>
                                <option value="Vacation">Vacation</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Personal Leave">Personal Leave</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.leaveType && (
                                <p className="text-red-500 text-sm mt-1">{errors.leaveType.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Reason</label>
                            <textarea
                                className={`w-full border rounded-md p-2 ${errors.reason ? 'border-red-500' : ''}`}
                                rows={3}
                                {...register("reason")}
                            ></textarea>
                            {errors.reason && (
                                <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            )}

            {/* Leave History */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Leave History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left">Date Range</th>
                                <th className="px-4 py-2 text-left">No. of Days</th>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeOffs.map((timeOff) => (
                                <tr className="border-t" key={timeOff.id}>
                                    <td className="px-4 py-2">{formatDate(timeOff.startDate)} - {formatDate(timeOff.endDate)}</td>
                                    <td className="px-4 py-2">{
                                        //@ts-expect-error added to the schema
                                        timeOff.workingDays
                                    }</td>
                                    <td className="px-4 py-2">{timeOff.leaveType}</td>
                                    <td className="px-4 py-2">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                            {timeOff.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{timeOff.reason}</td>
                                </tr>
                            ))}
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}