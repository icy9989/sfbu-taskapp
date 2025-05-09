'use client';

import { ClipLoader } from 'react-spinners';
import NoResult from '@/components/no-result';
import useTeams from '@/hooks/use-teams';
import TeamCard from './team-card';

const Teams = () => {
  const { data: teams, isLoading } = useTeams();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader />
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return <NoResult text="No teams available." width={200} height={200} />;
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {teams.map((team, index) => (
        <TeamCard
          key={team.id}
          team={{
            id: team.id,
            name: team.name,
            color: ['bg-violet-600', 'bg-rose-500', 'bg-amber-500'][index % 3],
          }}
        />
      ))}
    </div>
  );
};

export default Teams;
