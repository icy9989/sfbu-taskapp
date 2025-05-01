"use client";

import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";


const AddButton = ({ href }) => {

    const router = useRouter();

    return (
        <Button onClick={() => router.push(href)}>
            <PlusCircle className="w-4 h-4 mr-2"/>
            Add new
        </Button>
    )
}

export default AddButton