"use client";

import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, MessageSquare, Users, ListChecks, Box, ImageIcon, Utensils, ClipboardList, ShoppingBag, VideoIcon, Music, Code, CircleDollarSign, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const routes = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        // color: "text-sky-400"
    },
    {
        href: '/tasks',
        label: 'Tasks',
        icon: ListChecks,
        // color: "text-violet-500"
    },
    {
        href: '/teams',
        label: 'Teams',
        icon: Users,
        // color: "text-pink-700"
    },
    // {
    //     href: '/projects',
    //     label: 'Projects',
    //     icon: Utensils,
    //     // color: "text-fuchsia-500"
    // },
    // {
    //     href: '/orders',
    //     label: 'Orders',
    //     icon: ShoppingBag,
    //     // color: "text-orange-700"
    // },
    // {
    //     href: '/income',
    //     label: 'Income',
    //     icon: Music,
    //     // color: "text-emerald-500"
    // },
    // {
    //     href: '/expense',
    //     label: 'Expense',
    //     icon: CircleDollarSign,
    //     // color: "text-yellow-500"
    // },
    // {
    //   label: 'Settings',
    //   icon: Settings,
    //   href: '/settings',
    // },
  ];

const Sidebar = () => {

    const pathname = usePathname();

    const path = pathname.split("/");
    const originlPath = "/" + path[1];

  return (
    <div className="w-full h-full bg-primary py-5">
        <div className="flex justify-center pt-5">
            <div className="relative w-32 h-32">
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={100}
                    height={100}
                />
            </div>
        </div>
        <div className="flex flex-col space-y-1">
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                >
                    <div className={cn("flex flex-row items-center gap-4 py-3 px-5 hover:border-neutral-200 hover:bg-white/10 hover:text-white", 
                            route.href === originlPath ? "border-l-4 border-white bg-white/20 text-white" : "text-zinc-200"
                        )}>
                        <route.icon className="color: text-sky-300"  />
                        <p className="">{route.label}</p>
                    </div>
                </Link>       
            ))}
        </div>
    </div>
  )
}

export default Sidebar