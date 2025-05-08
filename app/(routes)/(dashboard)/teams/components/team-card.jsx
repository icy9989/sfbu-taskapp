'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CardAction from './card-action';
import useTeamMembers from '@/hooks/use-team-members';

const TeamCard = ({ team }) => {

  const { data: teamMembers, isLoading } = useTeamMembers();
  


  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/teams/${team.id}/details`);
  };

  return (
    <Card
  onClick={handleCardClick}
  className={`relative cursor-pointer transition-colors border-0 rounded-2xl p-5 bg-rose-400 hover:bg-rose-500 text-white`}
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
    {team.members.slice(0, 3).map((member, i) => (
      <Avatar key={i} className="w-8 h-8 border-2 border-white">
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
      </Avatar>
    ))}
    {team.members.length > 3 && (
      <div className="w-8 h-8 flex items-center justify-center bg-white text-rose-500 text-xs rounded-full border-2 border-white font-bold">
        +{team.members.length - 3}
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
      <span>{String(team.tasks).padStart(2, '0')} tasks</span>
      <span>{team.completion}%</span>
    </div>
    <Progress
      value={team.completion}
      className="h-2 rounded-full bg-white/30"
      indicatorClassName="bg-white"
    />
  </CardContent>
</Card>
  );
};

export default TeamCard;
