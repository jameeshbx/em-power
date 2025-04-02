// components/Header.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { AuthOptions } from "next-auth";
export const Topbar = async () => {
    const session = await getServerSession(authOptions as AuthOptions);
    return (
        <header className="bg-primary shadow-sm py-4 px-4">
            <nav className="container m-0 flex items-center justify-between">
                <div className="flex items-center gap-2">

                </div>
                <div className="space-x-6 text-white">
                    {session?.user?.name}
                </div>
            </nav>
        </header>
    )
}