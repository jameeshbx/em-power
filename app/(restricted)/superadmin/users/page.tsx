"use client";

import { useState, useEffect } from "react";
import CustomTable from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { toast } from "sonner";

import { User, UserRole } from "@prisma/client";

export default function UsersPage() {
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState(0);
    const [selectedUser, setSelectedUser] = useState<{
        id?: string;
        name: string;
        email: string;
        role: UserRole;
        password?: string;
        availableLeaves: number;
    } | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [managers, setManagers] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("/api/user");
            const data = await response.json();
            const managers = data.filter((user: User) => user.role === "MANAGER");
            setManagers(managers);
            setUsers(data);
        };
        fetchUsers();
    }, [key]);

    const columns = [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "role", label: "Role", sortable: true },
        { key: "action", label: "Action" },
    ];

    const handleEdit = (user: User) => {
        setSelectedUser({
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role,
            password: user.password,
            // @ts-ignore
            reportingToId: user.employee?.reportingToId || null,
            // @ts-ignore
            designation: user.employee?.designation || "",
            // @ts-ignore
            joiningDate: user.employee?.joiningDate || new Date(),
            // @ts-ignore
            availableLeaves: user.employee?.availableLeaves || 25
        });
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/user`, {
                method: "DELETE",
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            setUsers(users.filter((user) => user.id !== id));
            setKey(key + 1);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAction = (action: string, data: User) => {
        if (action === "add") {
            setSelectedUser(null);
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
                <h1 className="text-2xl font-bold">Users</h1>
            </div>

            <CustomTable
                columns={columns}
                data={users}
                onAction={(action, row) => handleAction(action, row as User)}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser ? "Edit User" : "Add User"}
                        </DialogTitle>
                    </DialogHeader>
                    <UserForm
                        user={selectedUser}
                        onClose={() => setOpen(false)}
                        onSuccess={() => {
                            setOpen(false);
                            setKey(key + 1);
                        }}
                        managers={managers}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
