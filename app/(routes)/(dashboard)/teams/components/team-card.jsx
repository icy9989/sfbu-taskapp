'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import CardAction from './card-action';

const TeamCard = ({ team }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/teams/${team.id}/details`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="border-0 bg-slate-50 relative shadow-md hover:bg-slate-100 cursor-pointer transition-colors"
    >
      <div
        className="absolute right-3 top-3 z-10"
        onClick={(e) => e.stopPropagation()} // 🛑 Stops card click from triggering
      >
        <CardAction id={team.id} />
      </div>
      <CardHeader className="flex flex-col items-center justify-center text-center sm:h-36">
        <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default TeamCard;
