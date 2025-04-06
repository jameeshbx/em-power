import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  Plane,
  Home,
} from "lucide-react";
interface IconComponent {
  className?: string;
  // This allows the component to accept any valid SVG/icon props
  [key: string]: any;
}

export const sidebarData: {
  name: string;
  path: string;
  icon: IconComponent;
  isActive: boolean;
  isVisible: boolean;
  permission: string[];
  submenu?: {
    name: string;
    path: string;
    icon?: IconComponent;
    isActive: boolean;
    isVisible: boolean;
    permission: string[];
  }[];
}[] = [
  {
    name: "Home",
    icon: Home,
    path: "/",
    isActive: true,
    isVisible: true,
    permission: ["SUPERADMIN", "ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/PERMISSION/dashboard",
    isActive: true,
    isVisible: true,
    permission: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "Departments",
    icon: Users,
    path: "/PERMISSION/departments",
    isActive: true,
    isVisible: true,
    permission: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "Users",
    icon: Users,
    path: "/PERMISSION/users",
    isActive: true,
    isVisible: true,
    permission: ["SUPERADMIN", "ADMIN", "MANAGER"],
  },
  {
    name: "Projects",
    icon: FolderKanban,
    path: "/PERMISSION/projects",
    isActive: true,
    isVisible: true,
    permission: ["SUPERADMIN", "ADMIN", "MANAGER"],
  },
  {
    name: "Tasks",
    icon: CheckSquare,
    path: "/PERMISSION/tasks",
    // submenu: [
    //   {
    //     name: "Sub Task",
    //     icon: UserIcon,
    //     path: "/PERMISSION/tasks/sub-task",
    //     isActive: true,
    //     isVisible: true,
    //     permission: ["ADMIN", "MANAGER", "STAFF"],
    //   },
    // ],
    isActive: true,
    isVisible: true,
    permission: ["SUPERADMIN", "ADMIN", "MANAGER"],
  },
  {
    name: "Time Logs",
    icon: Clock,
    path: "/PERMISSION/time-logs",
    isActive: true,
    isVisible: true,
    permission: ["SUPERADMIN", "ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "Time Off",
    icon: Plane,
    path: "/PERMISSION/time-off",
    isActive: true,
    isVisible: true,
    permission: ["MANAGER", "EMPLOYEE"],
  },
];
