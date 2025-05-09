// app/(dashboard)/teams/[id]/page.tsx

import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeam } from "@/hooks/useTeam";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Tasks from "./_components/tasks";

export default function TeamDetailsPage({ params }) {
  const { team } = useTeam(params.id);
  const { teamMembers } = useTeamMembers(params.id);

  if (!team) {
    return <div className="text-center mt-10 text-muted-foreground">Loading team details...</div>;
  }

  return (
    <div className="p-6 space-y-10">
      {/* Team Name Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{team.name}</h1>
        <p className="text-muted-foreground">Team Members and Task Overview</p>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teamMembers?.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-center text-center transition-all duration-200"
          >
            {/* Avatar */}
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

            {/* Name */}
            <p className="mt-4 text-pink-600 font-bold uppercase tracking-wide">
              {member.username}
            </p>

            {/* Role or Location Placeholder */}
            <p className="text-sm text-gray-500">
              {member.role || "Team Member"}
            </p>

            {/* Bio/Description Placeholder */}
            <p className="text-sm text-gray-600 mt-1">
              {member.bio || "Contributing to team success 🚀"}
            </p>
          </div>
        ))}
      </div>

      {/* Team Tasks Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tasks</h2>
        <Tasks teamId={params.id} />
      </div>
    </div>
  );
}
