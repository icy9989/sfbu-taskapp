"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const MobileAddButton = ({ href }) => {

    const router = useRouter();

    return (
        <Button
            onClick={() => router.push(href)} 
            className="w-[50px] h-[50px] rounded-full"
        >
            <Plus className="w-16 h-16"/>
        </Button>
    )
}

export default MobileAddButton