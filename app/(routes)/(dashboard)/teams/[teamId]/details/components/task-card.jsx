import { CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'
import CardAction from './card-action'

const TaskCard = ({ task, teamId }) => {
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
  }

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
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <Card className="rounded-xl border bg-white shadow-md p-4 hover:shadow-lg transition space-y-4">
      {/* Top: Title + Actions */}
      <div className="flex justify-between items-start">
        <CardTitle className="text-base font-semibold text-gray-900">
          {task.title}
        </CardTitle>
        <CardAction id={task.id} teamId={teamId} />
      </div>

      {/* Priority Badge */}
      <div>
        <Badge className={`text-xs rounded-md px-2 py-0.5 ${getPriorityStyle()}`}>
          {task.priority}
        </Badge>
      </div>

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

      {/* Bottom: Category & Status */}
      <div className="flex justify-between items-center pt-2 text-sm">
        <Badge variant="secondary" className="px-2 py-0.5 text-xs">
          {task.category}
        </Badge>
        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusStyle()}`}>
          {task.status}
        </span>
      </div>
    </Card>
  )
}

export default TaskCard
