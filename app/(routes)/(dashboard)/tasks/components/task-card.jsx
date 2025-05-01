import { CalendarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import CardAction from './card-action'

const TaskCard = ({ task }) => {

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

  return (
    <>
      <Card className="border-0 bg-slate-50 relative shadow-md">
        <div className='absolute right-3 top-3'>
          <CardAction id={task.id} />
        </div> 
        <CardHeader className="flex flex-col items-center text-center sm:h-36">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <CalendarIcon className="w-4 h-4" />
            {task.dueDate}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <Badge variant="secondary">{task.category}</Badge>
            <Badge
              className={
                task.priority === 'High'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : task.priority === 'Medium'
                  ? 'bg-orange-400 hover:bg-orange-500 text-white'
                  : 'bg-gray-300 text-black'
              }
            >
              {task.priority}
            </Badge>
          </div>

          <Badge variant="outline" className={getStatusStyle()}>
            {task.status}
          </Badge>

          {/* <Button
            onClick={() => setOpenTaskModal(true)}
            className="rounded-full px-5 bg-primary"
          >
            View Details
          </Button> */}
        </CardContent>
      </Card>
    </>
  )
}

export default TaskCard
