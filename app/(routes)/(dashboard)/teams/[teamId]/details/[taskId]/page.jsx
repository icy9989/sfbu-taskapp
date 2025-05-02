import { UserPlus, UserCog } from "lucide-react"

import Header from "@/components/header"

import AddTask from "./components/add-task"
import EditTask from "./components/edit-task"

const TaskPage = ({ params }) => {

  return (
    <> 
       <div className="h-full p-5">
            <div className="flex justify-between items-center border-b">
                <Header
                    title={params.taskId === "new" ? "Add New Task" : "Edit Task"}
                    description={params.taskId === "new" ? "Create a new task to do" : "Update the details in your existing task"}
                    icon={params.taskId === "new" ? UserPlus : UserCog}
                />
            </div>
            <div className="my-5 pb-10">
                {params.taskId === "new" ? <AddTask /> : <EditTask />}
            </div>
        </div>
    </>
  )
}

export default TaskPage