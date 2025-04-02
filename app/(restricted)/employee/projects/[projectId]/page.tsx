"use client";

import { useParams } from "next/navigation";
import { getProjectById } from "@/actions/project";
import { useEffect, useState } from "react";

import CustomTable from "@/components/CustomTable";
import { Task } from "@prisma/client";
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";


export default function Page() {
    const { projectId } = useParams();
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [key, setKey] = useState(0);
    const [project, setProject] = useState({
        name: "",
        description: "",
        status: "",
        startDate: "",
        endDate: "",
        members: [],
        tasks: [],
        department: {
            name: "",
        },
        createdBy: {
            name: "",
        },
        assignedTo: {
            name: "",
        },
    });
    useEffect(() => {
        const fetchProject = async () => {
            const projectData = await getProjectById(projectId as string);
            setTasks([]);
            projectData?.tasks.forEach((task: Task) => {
                const taskData = {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    // @ts-expect-error - task.assignee is not always present
                    assignee: task.assignee?.user.name,
                    assigneeId: task.assigneeId,
                }
                // @ts-expect-error - taskData is not always present
                setTasks((prevTasks) => [...prevTasks, taskData]);
            });
            //@ts-expect-error - projectData is not always present
            setProject(projectData);
        };
        fetchProject();
    }, [projectId, key]);

    const columns = [
        { key: "title", label: "Title", sortable: true },
        { key: "description", label: "Description", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "assignee", label: "Assignee", sortable: true },
        { key: "action", label: "Action", sortable: false },
    ]
    const deleteTask = async (id: string) => {
        const response = await fetch(`/api/task`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
        });
        if (response.ok) {
            setTasks(tasks.filter((task) => task.id !== id));
        }
    }
    const handleAction = (action: string, row: Task) => {
        if (action === "add") {
            setSelectedTask(null);
            setOpen(true);
        } else if (action === "edit") {
            setSelectedTask(row);
            setOpen(true);
        } else if (action === "delete") {
            deleteTask(row.id);
        }
    }


    return (
        <div className="p-6">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 bg-white p-4 rounded-lg">
                    <h1 className="text-2xl font-bold capitalize">Tasks</h1>
                    <CustomTable columns={columns} data={tasks} onAction={(action, row) => handleAction(action, row as Task)} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedTask ? "Edit Task" : "Add Task"}
                                </DialogTitle>
                            </DialogHeader>
                            <TaskForm
                                task={selectedTask as { title: string; status: string; projectId: string; id?: string | undefined; description?: string | undefined; assigneeId?: string | undefined; } | null | undefined}
                                onClose={() => setOpen(false)}
                                onSuccess={() => {
                                    setOpen(false);
                                    setKey(key + 1);
                                }}
                                employees={project.members.map((member: { id: string; user: { name: string } }) => ({
                                    id: member.id,
                                    name: member.user.name,
                                }))}
                                project={{
                                    // @ts-expect-error - project is not always present
                                    id: project.id,
                                    name: project.name,
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="col-span-4 bg-white p-4 rounded-lg">
                    <h1 className="text-2xl font-bold capitalize">{project.name}</h1>
                    <p className="text-sm text-gray-500">{project.description}</p>
                    <p className="text-sm text-gray-500">{project.status}</p>
                    <p className="text-sm text-gray-500">{new Date(project.startDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{new Date(project.endDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Department: {project.department.name}</p>
                    <h2 className="text-lg font-bold capitalize">Members</h2>
                    <div className="flex flex-col gap-2">
                        {project.members.map((member: { id: string; user: { name: string; email: string }; designation: string }) => (
                            <div key={member.id} className="flex flex-col gap-2">
                                <p className="text-sm text-md font-bold">{member.user.name}</p>
                                <p className="text-sm text-gray-500">{member.designation}</p>
                                <p className="text-sm text-gray-500">{member.user.email}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}