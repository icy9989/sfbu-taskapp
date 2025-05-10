'use client';

import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';
import CardAction from './card-action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAssignMembers from '@/hooks/use-assign-members';

const TaskCard = ({ task, teamId }) => {
  const router = useRouter();
  const { data: members = [], isLoading: memberLoading } = useAssignMembers(task.id);

  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusStyle = () => {
    switch (task.status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-orange-100 text-orange-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      onClick={() => router.push(`/teams/${teamId}/details/${task.id}/comments`)}
      className="relative cursor-pointer transition-colors border-0 rounded-2xl p-5 bg-white hover:shadow-lg"
    >
      {/* Action Button */}
      <div
        className="absolute right-3 top-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <CardAction id={task.id} teamId={teamId} />
      </div>

      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {task.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {/* Priority Badge */}
        <Badge className={`text-xs rounded-md px-2 py-0.5 ${getPriorityStyle()}`}>
          {task.priority}
        </Badge>

        {/* Dates */}
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Start:</span> {formatDate(task.startDate)}
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Due:</span> {formatDate(task.dueDate)}
          </div>
        </div>

        {/* Category & Status */}
        <div className="flex justify-between items-center pt-2 text-sm">
          <Badge variant="secondary" className="px-2 py-0.5 text-xs">
            {task.category}
          </Badge>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusStyle()}`}>
            {task.status}
          </span>
        </div>

        {/* Assigned Members */}
        {members.length > 0 && (
          <div className="flex items-center pt-2 space-x-2">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member, i) => (
                <Avatar key={member.id || i} className="w-8 h-8 border-2 border-white bg-violet-500">
                  <AvatarImage src={member.avatar || ''} alt={member.username} />
                  <AvatarFallback className="text-xs text-white bg-amber-500">
                    {member.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 3 && (
                <div className="w-8 h-8 flex items-center justify-center bg-white text-rose-500 text-xs rounded-full border-2 border-white font-bold">
                  +{members.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
