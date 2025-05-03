import Link from 'next/link'
import { CalendarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import CardAction from './card-action'

const TeamCard = ({ team }) => {
  return (
    <Link href={`/teams/${team.id}/details`}>
      <Card className="border-0 bg-slate-50 relative shadow-md hover:bg-slate-100 cursor-pointer transition-colors">
        <div className="absolute right-3 top-3 z-10">
          <CardAction id={team.id} />
        </div>
        <CardHeader className="flex flex-col items-center text-center sm:h-36">
          <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default TeamCard
