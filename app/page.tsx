'use client'

import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await useUser();
      if (user?.role === "EMPLOYEE") {
        redirect(`/employee/${user.id}`);
      } else {
        redirect("/admin/dashboard");
      }
    }
    fetchCurrentUser();
  }, []);




}
