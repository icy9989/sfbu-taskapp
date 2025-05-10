"use client"

import { ClipLoader } from "react-spinners";

import NoResult from "@/components/no-result";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import TaskCard from "./task-card";  // Card component for tasks
import useTeamMembers from "@/hooks/use-team-members";
import useTeam from "@/hooks/use-team"
import { useParams } from "next/navigation";

const Members = () => {

    const params = useParams()
    const { data: team, isLoading: teamLoading } = useTeam(params.teamId);
    const { data: members, isLoading: memberLoading } = useTeamMembers(params.teamId);

    if (teamLoading || memberLoading) {
        return (
            <div className="flex justify-center items-center h-72">
                <ClipLoader color="#6b0407" size={28} />
            </div>
        );
    }

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{team.name}</h1>
                <p className="text-muted-foreground mb-4">{team.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-center text-center transition-all duration-200"
                  >
                    <Avatar className="w-16 h-16 border-2 border-pink-500">
                      <AvatarImage
                        src={member.image || undefined}
                        alt={member.username}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {member.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
        
                    <p className="mt-4 text-pink-600 font-bold uppercase tracking-wide">
                      {member.username}
                    </p>
        
                    <p className="text-sm text-gray-500">
                      {member.role || "Team Member"}
                    </p>
        
                    <p className="text-sm text-gray-600 mt-1">
                      {member.bio || "Contributing to team success 🚀"}
                    </p>
                  </div>
                ))}
            </div>
        </>
         
    )

};

export default Members;
