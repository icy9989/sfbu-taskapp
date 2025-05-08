"use client";

import { ClipLoader } from "react-spinners";
import { Users } from "lucide-react";
import { useParams } from "next/navigation";
import AddButton from "@/components/add-button";
import MobileAddButton from "@/components/mobile-add-button";
import Tasks from "./components/tasks";
import useTeam from "@/hooks/use-team";
import useTeamMembers from "@/hooks/use-team-members";

const DetailPage = () => {
  const params = useParams();
  const { data: fetchedTeam, isLoading } = useTeam(params.teamId);
  const { data: teamMembers, isLoading: MemberLoading } = useTeamMembers(params.teamId);

  console.log("fetchedTeam", fetchedTeam)

  if (isLoading && MemberLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ClipLoader color="#6b0407" size={28} />
      </div>
    );
  }

  return (
    <>
      <div className="h-full p-5">
        {/* Team Header Section */}
        <div className="flex justify-between items-center border-b pb-5">
          <div className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-md bg-primary/10">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-700 flex items-center gap-2">
                {fetchedTeam.name}
              </h3>
              <p className="text-sm text-light text-muted-foreground">
                {fetchedTeam.description}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex">
            <AddButton href={`/teams/${params.teamId}/details/new`} />
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mt-8">
          <h4 className="text-3xl font-semibold text-zinc-800 mb-6">Team Members</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers?.map((member) => (
              <div
                key={member.id}
                className="relative flex flex-col items-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Member Profile Picture */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white mb-3 shadow-lg">
                  <Users className="w-full h-full object-cover" />
                </div>

                {/* Member Name and Role */}
                <div className="text-center space-y-1">
                  <p className="text-xl font-semibold text-white">{member.username}</p>
                  <p className="text-md font-medium text-yellow-200">{member.role}</p>
                  <p className="text-sm text-gray-300">{member.position}</p>
                </div>

                {/* Hover Badge (Optional) */}
                <div className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 text-xs font-semibold text-white rounded-full transform opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="my-5 pb-10">
        <h4 className="text-3xl font-semibold text-zinc-800 mb-6 pt-10">Tasks</h4>
          <Tasks />
        </div>

        <div className="sm:hidden mt-10 fixed bottom-5 right-5">
          <MobileAddButton href={`/teams/${params.teamId}/details/new`} />
        </div>
      </div>
    </>
  );
};

export default DetailPage;
