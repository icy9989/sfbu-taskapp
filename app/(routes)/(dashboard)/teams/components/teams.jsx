'use client';

import { ClipLoader } from 'react-spinners';
import NoResult from '@/components/no-result';
import useTeams from '@/hooks/use-teams';
import useTeamMembers from '@/hooks/use-team-members';
import useTeamTasks from '@/hooks/use-team-tasks'; // new
import TeamCard from './team-card';

const Teams = () => {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: teamMembers, isLoading: membersLoading } = useTeamMembers();
  const { data: tasks, isLoading: tasksLoading } = useTeamTasks();

  if (teamsLoading || membersLoading || tasksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader />
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return <NoResult text="No teams available." width={200} height={200} />;
  }

  const membersByTeam = (teamMembers || []).reduce((acc, member) => {
    if (!acc[member.teamId]) acc[member.teamId] = [];
    acc[member.teamId].push({
      name: member.username,
      avatar: "", // placeholder
      initials: member.username?.slice(0, 2).toUpperCase() || "",
    });
    return acc;
  }, {});

  const tasksByTeam = tasks?.reduce((acc, task) => {
    if (!acc[task.teamId]) acc[task.teamId] = [];
    acc[task.teamId].push(task);
    return acc;
  }, {}) || {};

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {teams.map((team, index) => {
        const members = membersByTeam[team.id] || [];
        const teamTasks = tasksByTeam[team.id] || [];
        const taskCount = teamTasks.length;
        const avgProgress = taskCount
          ? Math.round(teamTasks.reduce((sum, t) => sum + t.progress, 0) / taskCount)
          : 0;

        return (
          <TeamCard
            key={team.id}
            team={{
              ...team,
              members,
              tasks: taskCount,
              completion: avgProgress,
              color: ['bg-violet-300', 'bg-rose-300', 'bg-amber-300'][index % 3],
            }}
          />
        );
      })}
    </div>
  );
};

export default Teams;
