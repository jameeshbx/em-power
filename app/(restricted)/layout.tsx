

import App from "@/app/App"
import { Topbar } from "@/components/Topbar";
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (

        <div className="flex">

            <App />

            <main className={`flex-1 bg-primary-foreground overflow-auto p-0 transition-all duration-300 }`}>
                <Topbar />
                {children}
            </main>
        </div>
    );
}
