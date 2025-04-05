'use client'

import { useState, useEffect } from 'react';
import { TaskForm } from '@/app/(restricted)/superadmin/tasks/TaskForm';
import { Employee, Project, Task } from '@prisma/client';
import CustomTable from '@/components/CustomTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeleteConfirm } from '@/components/DeleteConfirm';

export default function Page() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [key, setKey] = useState(0);
    const [projects, setProjects] = useState<Project[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const columns = [
        {
            key: 'title',
            label: 'Title',
            sortable: true,
        },
        {
            key: 'project',
            label: 'Project',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
        },
        {
            key: 'assignee',
            label: 'Assignee',
            sortable: true,
        },
        {
            key: 'createdAt',
            label: 'Created At',
            sortable: true,
        },
        {
            key: 'action',
            label: 'Action',
        }
    ];

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/project');
            const data = await response.json();
            setProjects(data);
        }
        const fetchEmployees = async () => {
            const response = await fetch('/api/employee');
            const data = await response.json();
            setEmployees(data);
        }

        fetchProjects();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('/api/task');
        const data = await response.json();

        const modifiedTasks = data.map((task: Task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            // @ts-expect-error project is not included in the response
            project: task.project.name,
            projectId: task.projectId,
            // @ts-expect-error assignee is not included in the response
            assignee: task.assignee?.user?.name || 'Unassigned',
            assigneeId: task.assigneeId,
            createdAt: task.createdAt,
        }));
        setTasks(modifiedTasks);
    }

    useEffect(() => {
        fetchTasks();
    }, [key]);

    const handleDelete = async () => {
        const response = await fetch(`/api/task`, {
            method: 'DELETE',
            body: JSON.stringify({ id: selectedTask?.id }),
        });
        if (response.ok) {
            setKey(key + 1);
        }
        setShowDeleteDialog(false);
    }

    const handleAction = (action: string, data: Task) => {
        if (action === 'add') {
            setSelectedTask(null);
            setOpen(true);
        } else if (action === 'edit') {
            setSelectedTask(data);
            setOpen(true);
        }
        else if (action === 'delete') {

            setSelectedTask(data);
            setShowDeleteDialog(true);
        }
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedTask(null);
        setKey(key + 1);
    }

    const handleSuccess = () => {
        setOpen(false);
        setSelectedTask(null);
        setKey(key + 1);
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
            </div>
            <CustomTable
                data={tasks}
                columns={columns}
                onAction={(action, row) => handleAction(action, row as Task)}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedTask ? "Edit Task" : "Add Task"}
                        </DialogTitle>
                    </DialogHeader>
                    <TaskForm
                        initialData={selectedTask || undefined}
                        onClose={handleClose}
                        onSuccess={handleSuccess}
                        projects={projects}
                        employees={employees}
                    />
                </DialogContent>
            </Dialog>

            <DeleteConfirm
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                item={selectedTask?.title || ''}
            />
        </div>
    )
}
