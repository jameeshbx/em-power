"use client";

import { useState, useEffect } from "react";
import CustomTable from "@/components/CustomTable";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { DepartmentForm } from "./DepartmentForm";

import { Department } from "@prisma/client";

interface Employee {
    id: string;
    name: string;
}

interface Project {
    id: string;
    name: string;
}

export default function DepartmentsPage() {
    const [open, setOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [key, setKey] = useState(0);
    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch("/api/employee");
            const data = await response.json();
            setEmployees(data);
        }
        const fetchProjects = async () => {
            const response = await fetch("/api/project");
            const data = await response.json();
            setProjects(data);
        }
        fetchEmployees();
        fetchProjects();
    }, []);
    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await fetch("/api/department");
            const data = await response.json();
            setDepartments(data);
        };
        fetchDepartments();
    }, [key]);

    const columns = [
        { key: "name", label: "Name", sortable: true },
        { key: "action", label: "Action" },
    ];

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/department`, {
                method: "DELETE",
                body: JSON.stringify({ id }),
            });
            setDepartments(departments.filter((department) => department.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleAction = (action: string, data: Department) => {
        if (action === "add") {
            setSelectedDepartment(null);
            setOpen(true);
        } else if (action === "edit") {
            handleEdit(data);
        } else if (action === "delete") {
            handleDelete(data.id);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Departments</h1>

            </div>

            <CustomTable
                columns={columns}
                data={departments}
                onAction={(action, row) => handleAction(action, row as Department)}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDepartment ? "Edit Department" : "Add Department"}
                        </DialogTitle>
                    </DialogHeader>
                    <DepartmentForm
                        department={selectedDepartment}
                        onClose={() => setOpen(false)}
                        onSuccess={() => {
                            setOpen(false);
                            setKey(key + 1);
                        }}
                        employees={employees}
                        projects={projects}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}