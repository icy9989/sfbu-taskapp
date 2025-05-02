"use client"

import { ClipLoader } from "react-spinners";

import NoResult from "@/components/no-result";

import useTeams from "@/hooks/use-teams";  

import TeamCard from "./team-card"; 

const Teams = () => {

    const { data: teams, isLoading } = useTeams();
  
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-72">
                <ClipLoader color="#6b0407" size={28} />
            </div>
        );
    }

    return (
        <>
            {teams?.length === 0 ? (
                <NoResult text="No teams available." width={200} height={200} />
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {teams?.map((team) => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            )}

        </>
    );
};

export default Teams;
