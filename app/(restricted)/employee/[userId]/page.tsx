'use client'

import { getUserById } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
interface ProfilePageProps {
    params: Promise<{ userId: string }> // params is now a Promise
}

export default function Page({ params }: ProfilePageProps) {
    const { userId } = use(params);
    const [user, setUser] = useState({
        name: "",
        email: "",
        employee: {
            projects: [],
            designation: "",
            reportingTo: {
                user: {
                    name: "",
                }
            },
            departments: [],
            availableLeaves: 0,
            joiningDate: "",
        }
    });
    const router = useRouter();
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserById(userId);
            //@ts-ignore
            setUser(userData);
        };
        fetchUser();
    }, [userId]);
    return (
        <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold capitalize">
                        Projects
                    </h1>
                    {user?.employee?.projects.map((project: any) => (
                        <Card key={project.id} className="flex flex-col gap-2 cursor-pointer" onClick={() => router.push(`/employee/projects/${project.id}`)}>
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    {project.status}
                                </p>
                                <p>
                                    Start Date: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}
                                </p>
                                <p>
                                    End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
                                </p>
                            </CardContent>

                        </Card>

                    ))}

                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold capitalize">
                        {user?.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {user?.email}
                        <br />
                        {user?.employee?.designation}
                        <br />
                        {user?.employee?.departments.map((department: any) => department.name).join(", ")}
                        <br />
                        Reporting to <br />
                        {user?.employee?.reportingTo?.user?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                        Leave Balance: {user?.employee?.availableLeaves}
                        <br />
                        Joining Date:{" "}
                        {user?.employee?.joiningDate
                            ? new Date(user?.employee?.joiningDate).toLocaleDateString()
                            : "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
}