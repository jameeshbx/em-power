'use client'

import { useState, useEffect } from 'react';
import { ProjectForm } from './ProjectForm';
import { Department, Employee, Project } from '@prisma/client';
import CustomTable from '@/components/CustomTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [key, setKey] = useState(0);

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'department',
            label: 'Department',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
        },
        {
            key: 'startDate',
            label: 'Start Date',
        },
        {
            key: 'endDate',
            label: 'End Date',
        },
        {
            key: 'createdBy',
            label: 'Created By',
            sortable: true,
        },
        {
            key: 'action',
            label: 'Action',
        }
    ]

    const [departments, setDepartments] = useState<Department[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await fetch('/api/department');
            const data = await response.json();
            setDepartments(data);
        }
        const fetchEmployees = async () => {
            const response = await fetch('/api/employee');
            const data = await response.json();
            setEmployees(data);
        }

        fetchDepartments();
        fetchEmployees();
    }, []);

    const fetchProjects = async () => {
        const response = await fetch('/api/project');
        const data = await response.json();
        const modifyProjects = data.map((project: Project) => ({
            id: project.id,
            name: project.name,
            // @ts-expect-error department is not included in the response
            department: project.department.name,
            departmentId: project.departmentId,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            // @ts-expect-error createdBy is not included in the response
            createdBy: project.createdBy.name,
            createdById: project.createdById,
            // @ts-expect-error assignedTo is not included in the response
            assignedTo: project.assignedTo.userId,
            assignedToId: project.assignedToId,
            // @ts-expect-error members is not included in the response
            members: project.members.map((member) => member.id),
        }));
        setProjects(modifyProjects);
    }


    useEffect(() => {
        fetchProjects();
    }, [key]);

    const handleDelete = async () => {
        const response = await fetch(`/api/project`, {
            method: 'DELETE',
            body: JSON.stringify({ id: selectedProject?.id }),
        });
        if (response.ok) {
            setKey(key + 1);
        }
    }
    const handleAction = (action: string, data: Project) => {
        if (action === 'add') {
            setSelectedProject(null);
            setOpen(true);
        } else if (action === 'edit') {
            setSelectedProject(data);
            setOpen(true);
        }
        else if (action === 'delete') {
            setSelectedProject(data);
            handleDelete();
        }
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedProject(null);
        setKey(key + 1);
    }

    const handleSuccess = () => {
        setOpen(false);
        setSelectedProject(null);
        setKey(key + 1);
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
            </div>
            <CustomTable data={projects} columns={columns} onAction={(action, row) => handleAction(action, row as Project)} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedProject ? "Edit Project" : "Add Project"}
                        </DialogTitle>
                    </DialogHeader>
                    <ProjectForm
                        initialData={selectedProject || undefined}
                        onClose={handleClose}
                        onSuccess={handleSuccess}
                        departments={departments}
                        employees={employees}
                    />
                </DialogContent>
            </Dialog>

        </div>
    )
}