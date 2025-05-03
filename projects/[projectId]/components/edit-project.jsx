"use client";

import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";

import NotFound from "@/components/not-found";

import useTeam from "@/hooks/use-team";
import TeamForm from "./team-form";

const EditTeam = () => {

    const params = useParams();
    const { data: fetchedTeam, isLoading } = useTeam(params.teamId);

    if(isLoading) {
        return (
            <div className='flex justify-center items-center h-40'>
                <ClipLoader color='#6b0407' size={28} />
            </div>
        )
    }

    if(!isLoading && fetchedTeam === undefined) {
        return (
            <NotFound text="Team not found" />
        )
    }

    return (
        <TeamForm initialData={fetchedTeam} />
    )
}

export default EditTeam