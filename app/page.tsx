'use client'

import { redirect } from "next/navigation";
import { useEffect } from "react";
export default function Home() {

  useEffect(() => {
    const setHomeUrl = async () => {
      const response = await fetch("/api/me");
      const data = await response.json();
      const resolvedUser = data;
      if (resolvedUser?.role === "EMPLOYEE") {
        redirect(`/employee/${resolvedUser.id}`);
      } else if (resolvedUser?.role === "SUPERADMIN") {
        redirect(`/superadmin/users`);
      } else if (resolvedUser?.role === "ADMIN") {
        redirect(`/admin/users`);
      } else if (resolvedUser?.role === "MANAGER") {
        redirect(`/manager/projects`);
      }
    };
    setHomeUrl();
  }, []);




}
