'use client'

import React, { useState } from 'react';
import { sidebarData } from '@/data/sidebarItems';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { LogOut } from 'lucide-react';



interface SidebarProps {
    isMini: boolean;
    toggleSidebar: () => void;
}



const Sidebar: React.FC<SidebarProps> = ({ isMini, toggleSidebar }) => {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const { data: session } = useSession();

    const router = useRouter();
    const toggleExpand = (itemName: string) => {
        setExpandedItems(prev =>
            prev.includes(itemName)
                ? prev.filter(item => item !== itemName)
                : [...prev, itemName]
        );
    };

    const handleClick = (path: string) => {
        //@ts-expect-error role is not defined in the session
        const url = path.replace("PERMISSION", session?.user?.role.toLowerCase());
        router.push(url);
    };

    const isActivePath = (path: string) => {
        //@ts-expect-error role is not defined in the session
        return path.replace("PERMISSION", session?.user?.role.toLowerCase()) === pathname;
    };

    return (
        <div
            className={`bg-secondary text-white h-screen flex flex-col ${isMini ? 'w-16' : 'w-64'
                } transition-all duration-300 ease-in-out fixed lg:relative`}
        >
            <div className="p-4">
                <div className={`flex items-center justify-between ${isMini ? 'justify-center' : 'justify-between'}`}>
                    {!isMini && <h1 className="text-2xl font-bold">BuyEX </h1>}
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        {isMini ? '☰' : '✕'}
                    </button>
                </div>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {
                        //@ts-expect-error role is not defined in the session
                        sidebarData.filter((item) => item.permission.includes(session?.user?.role.toUpperCase())).map((item) => (
                            <li key={item.name} className={`${isActivePath(item.path) ? 'bg-primary' : 'hover:bg-primary/80'} px-4 mx-1 rounded-lg`}>
                                <div className={`flex items-center px-2 py-2 cursor-pointer
                                ${isMini ? 'justify-center' : 'justify-between'}`}>
                                    <span className="flex items-center"
                                        onClick={() => handleClick(item.path)}
                                    >
                                        {
                                            //@ts-expect-error ICON component is rendered as a function component
                                            item.icon && React.createElement(item.icon, { className: `w-5 h-5 ${pathname === item.path ? 'text-secondary' : ''}` })}
                                        {!isMini && (
                                            <span className={`${pathname === item.path ? 'text-secondary' : ''} ml-4`}>
                                                {item.name}
                                            </span>
                                        )}
                                    </span>
                                    {!isMini && item.submenu && (
                                        <Button
                                            onClick={() => toggleExpand(item.name)}
                                            className="p-1"
                                        >
                                            <svg
                                                className={`w-4 h-4 transition-transform ${expandedItems.includes(item.name) ? 'rotate-180' : ''
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    )}
                                </div>
                                {!isMini && item.submenu && expandedItems.includes(item.name) && (
                                    <ul className="pl-8 mt-2 space-y-2">
                                        {item.submenu.map((subItem) => (
                                            <li key={subItem.name}>
                                                <span
                                                    onClick={() => handleClick(subItem.path)}
                                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg
                                                    ${pathname === subItem.path ? 'bg-primary text-secondary' : 'hover:bg-primary/80'}`}
                                                >
                                                    {
                                                        //@ts-expect-error ICON component is rendered as a function component
                                                        subItem.icon && React.createElement(subItem.icon, { className: "w-4 h-4" })}
                                                    <span>{subItem.name}</span>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                </ul>
            </nav>
            <footer className="p-4 mb-2">
                <Button
                    className={`w-full flex items-center justify-center px-4 py-2 text-white hover:bg-primary/80 rounded-lg `}
                    onClick={() => signOut()}
                >
                    {!isMini && <span >Logout</span>}
                    <LogOut className="w-4 h-4" />
                </Button>
            </footer>
        </div>
    );
};

export default Sidebar;