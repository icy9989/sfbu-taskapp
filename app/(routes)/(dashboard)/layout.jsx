"use client";

import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const DashboardLayout = ({ children }) => {

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
        redirect("/login");
    },
  });

    return (
      <div className="h-full">
        <div className="w-72 h-full hidden lg:fixed lg:flex">
            <Sidebar />
        </div>
        <div className="h-full lg:ml-72">
            <Navbar />
            <div className="h-full pt-[58px]">
                {children}
            </div>
        </div>
      </div>
    )
}
  
export default DashboardLayout