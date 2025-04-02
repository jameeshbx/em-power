'use client'

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { SessionProvider } from 'next-auth/react';

const App: React.FC = () => {
    const [isMini, setIsMini] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsMini(!isMini);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="flex">
            <div className={`lg:hidden fixed top-0 left-0 p-4 z-50`}>
                <button onClick={toggleMobileSidebar} className="text-white focus:outline-none">
                    ☰
                </button>
            </div>
            <div
                className={`${isMobileSidebarOpen ? 'block' : 'hidden'
                    } lg:block lg:relative fixed lg:static inset-0 bg-black bg-opacity-50 z-40`}
                onClick={toggleMobileSidebar}
            ></div>
            <SessionProvider>
                <Sidebar isMini={isMini} toggleSidebar={toggleSidebar} />
            </SessionProvider>
        </div>
    );
};

export default App;