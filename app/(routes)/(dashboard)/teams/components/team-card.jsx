'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CardAction from './card-action';
import useTeamMembers from '@/hooks/use-team-members';
import useTeamTasks from '@/hooks/use-team-tasks';

const TeamCard = ({ team }) => {
  const router = useRouter();

  // Fetch team-specific data
  const { data: members = [], isLoading: membersLoading } = useTeamMembers(team.id);
  const { data: tasks = [], isLoading: tasksLoading } = useTeamTasks(team.id);

  const filteredTasks = tasks.filter(t => t.teamId === team.id);
  const taskCount = filteredTasks.length;
  const avgProgress = taskCount
  ? Math.round(filteredTasks.reduce((sum, t) => sum + t.progress, 0) / taskCount)
  : 0;


  // const taskCount = tasks.length;
  // const avgProgress = taskCount
  //   ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / taskCount)
  //   : 0;

  const displayMembers = (members || []).slice(0, 3).map((m) => ({
    name: m.username,
    avatar: '',
    initials: m.username?.slice(0, 2).toUpperCase() || '',
  }));

  return (
    <Card
      onClick={() => router.push(`/teams/${team.id}/details`)}
      className={`relative cursor-pointer transition-colors border-0 rounded-2xl p-5 ${team.color} hover:opacity-90 text-white`}
    >
      {/* Action Button */}
      <div
        className="absolute right-3 top-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <CardAction id={team.id} />
      </div>

      {/* Avatar Section */}
      <div className="flex space-x-[-8px] mb-4">
        {displayMembers.map((member, i) => (
          <Avatar key={i} className="w-8 h-8 border-2 border-white">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-xs text-black">{member.initials}</AvatarFallback>
          </Avatar>
        ))}
        {members.length > 3 && (
          <div className="w-8 h-8 flex items-center justify-center bg-white text-rose-500 text-xs rounded-full border-2 border-white font-bold">
            +{members.length - 3}
          </div>
        )}
      </div>

      {/* Team Name */}
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-lg font-semibold text-white">
          {team.name}
        </CardTitle>
      </CardHeader>

      {/* Task Info */}
      <CardContent className="p-0">
        <div className="flex justify-between text-sm font-medium text-white/90 mb-1">
          <span>{taskCount} tasks</span>
          <span>{avgProgress}%</span>
        </div>
        <Progress
          value={avgProgress}
          className="h-2 rounded-full bg-white/30"
          indicatorClassName="bg-white"
        />
      </CardContent>
    </Card>
  );
};

export default TeamCard;
