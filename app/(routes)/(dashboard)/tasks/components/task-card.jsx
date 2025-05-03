import { CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import CardAction from './card-action'

const TaskCard = ({ task }) => {
  // Get status badge styles
  const getStatusStyle = () => {
    switch (task.status) {
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-500'
      case 'In Progress':
        return 'bg-yellow-200 text-yellow-700 border-yellow-500'
      case 'Completed':
        return 'bg-green-200 text-green-700 border-green-500'
      default:
        return ''
    }
  }

  // Get priority badge styles
  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'High':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'Medium':
        return 'bg-orange-400 hover:bg-orange-500 text-white'
      case 'Low':
        return 'bg-green-400 hover:bg-green-500 text-white'
      case 'Urgent':
        return 'bg-pink-500 hover:bg-pink-600 text-white'
      default:
        return 'bg-gray-300 text-black'
    }
  }

  // Date formatting function
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <Card className="bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 ease-in-out relative">
      {/* Action Button */}
      <div className='absolute right-3 top-3'>
        <CardAction id={task.id} />
      </div>

      <CardHeader className="flex flex-col items-center sm:h-40 p-6 text-center">
        {/* Task Title */}
        <CardTitle className="text-2xl font-semibold text-gray-900">{task.title}</CardTitle>

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

      <CardContent className="flex flex-col items-center gap-4 p-6">
        {/* Category & Priority Badges */}
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">{task.category}</Badge>
          <Badge
            className={`${getPriorityStyle()} text-sm`}
          >
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
