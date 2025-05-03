import { CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import CardAction from './card-action'

const TaskCard = ({ task, teamId }) => {
  // Status Badge Style based on the task status
  const getStatusStyle = () => {
    switch (task.status) {
      case 'Pending':
        return 'bg-gray-100 text-gray-600 border'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500'
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-500'
      default:
        return ''
    }
  }

  // Priority Badge Style
  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'High':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'Medium':
        return 'bg-orange-400 hover:bg-orange-500 text-white'
      case 'Low':
        return 'bg-green-400 hover:bg-green-500 text-white'
      default:
        return 'bg-gray-300 hover:bg-gray-400 text-black'
    }
  }

  return (
    <Card className="border-0 bg-white shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 ease-in-out relative">
      {/* Action Button */}
      <div className='absolute right-3 top-3'>
        <CardAction id={task.id} teamId={teamId} />
      </div>

      {/* Card Header */}
      <CardHeader className="flex flex-col items-center text-center sm:h-40 p-6">
        {/* Task Title */}
        <CardTitle className="text-xl font-semibold text-gray-900">{task.title}</CardTitle>

       {/* Date and Calendar Icon */}
       <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Start and End Date */}
        <div className="mt-2 text-sm text-gray-500">
          <span className="font-medium text-gray-600">Start:</span> {formatDate(task.startDate)} <span className="mx-2">|</span> <span className="font-medium text-gray-600">End:</span> {formatDate(task.dueDate)}
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex flex-col items-center gap-4 p-6">
        {/* Category and Priority Badges */}
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">{task.category}</Badge>
          <Badge className={`${getPriorityStyle()} text-sm`}>
            {task.priority}
          </Badge>
        </div>

        {/* Status Badge */}
        <Badge variant="outline" className={`${getStatusStyle()} text-sm`}>
          {task.status}
        </Badge>
      </CardContent>
    </Card>
  )
}

export default TaskCard
