'use client'

import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
export default function Home() {
  const user = useUser();
  useEffect(() => {
    const setHomeUrl = async () => {
      const resolvedUser = await user;
      if (resolvedUser?.role === "EMPLOYEE") {
        redirect(`/employee/${resolvedUser.id}`);
      } else {
        redirect("/admin/dashboard");
      }
    }
    setHomeUrl();
  }, [user]);




}
