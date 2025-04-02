'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TimeLog } from '@prisma/client';
import CustomTable from '@/components/CustomTable';
import TimeLogForm from './TimeLogForm';
import { getMyTasks } from '@/actions/task';
import { getMyTimelogs } from '@/actions/timelogs';
export default function Page() {
    const [open, setOpen] = useState(false);
    const [selectedTimeLog, setSelectedTimeLog] = useState<TimeLog | null>(null);
    const [tasks, setTasks] = useState<Partial<Task>[]>([]);
    const [timeLogs, setTimeLogs] = useState<{
        id: string;
        task: string;
        hours: string | null;
        startTime: string;
        endTime: string | null;
        notes: string | null;
        taskId: string;
    }[]>([]);
    const [key, setKey] = useState(0);

    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours === 0) {
            return `${remainingMinutes}m`;
        }
        return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
    };

    useEffect(() => {
        const fetchTimeLogs = async () => {
            setTimeLogs([]);
            const timelogs = await getMyTimelogs()
            timelogs.forEach(log => {
                const obj = {
                    id: log.id,
                    task: log.task.title,
                    hours: log.duration ? formatDuration(log.duration) : null,
                    startTime: log.startTime.toLocaleString(),
                    endTime: log.endTime ? log.endTime.toLocaleString() : null,
                    notes: log.notes,
                    taskId: log.taskId,
                }
                setTimeLogs(prev => [...prev, obj]);
            });
        }
        const fetchTasks = async () => {
            const tasks = await getMyTasks();
            setTasks(tasks);
        }

        fetchTimeLogs();
        fetchTasks();
    }, [key]);



    const columns = [
        { key: 'task', label: 'Task', sortable: true },
        { key: 'hours', label: 'Hours', sortable: true },
        { key: 'startTime', label: 'Start', sortable: true },
        { key: 'endTime', label: 'End', sortable: true },
        { key: 'notes', label: 'Notes', sortable: true },
        { key: 'action', label: 'Action', sortable: false },
    ]
    const deleteTimeLog = async (id: string) => {
        const response = await fetch(`/api/time-logs`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    }

    const handleAction = (action: string, row: TimeLog) => {
        if (action === 'add') {
            setSelectedTimeLog(null);
            setOpen(true);
        } else if (action === 'edit') {
            setSelectedTimeLog(row);
            setOpen(true);
        } else if (action === 'delete') {
            deleteTimeLog(row.id);
        }
    }


    return (




        <div className='p-6'>
            <div className='flex'>

                <div className='bg-white p-4 rounded-lg w-full'>
                    <CustomTable columns={columns} data={timeLogs} onAction={(action, row) => handleAction(action, row as TimeLog)} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Time Log</DialogTitle>
                            </DialogHeader>
                            <TimeLogForm log={selectedTimeLog} tasks={tasks} onClose={() => setOpen(false)} onSuccess={() => {
                                setOpen(false);
                                setKey(key + 1);
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}