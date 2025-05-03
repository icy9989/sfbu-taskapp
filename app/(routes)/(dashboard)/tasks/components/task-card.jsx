import { CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import CardAction from './card-action'

const TaskCard = ({ task }) => {
  const getStatusStyle = () => {
    switch (task.status) {
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-500' // Red for Pending status
      case 'In Progress':
        return 'bg-yellow-200 text-yellow-700 border-yellow-500'
      case 'Completed':
        return 'bg-green-200 text-green-700 border-green-500'
      default:
        return ''
    }
  }

  // Get Priority Badge Styles
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

  // Date Formatting (You can replace this with a date library like `date-fns` for better formatting)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <Card className="border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out relative rounded-xl">
      <div className='absolute right-3 top-3'>
        <CardAction id={task.id} />
      </div> 
      <CardHeader className="flex flex-col items-center text-center sm:h-36 p-6">
        <CardTitle className="text-2xl font-semibold text-gray-800">{task.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <span className="font-medium text-gray-600">Start:</span> {formatDate(task.startDate)} <span className="mx-2">|</span> <span className="font-medium text-gray-600">End:</span> {formatDate(task.dueDate)}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 p-6">
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">{task.category}</Badge>
          <Badge
            className={`${getPriorityStyle()} text-sm`}
          >
            {task.priority}
          </Badge>
        </div>

        <Badge variant="outline" className={`${getStatusStyle()} text-sm`}>
          {task.status}
        </Badge>
      </CardContent>
    </Card>
  )
}

export default TaskCard
