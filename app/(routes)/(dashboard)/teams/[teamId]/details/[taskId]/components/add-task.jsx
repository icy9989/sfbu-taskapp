import TaskForm from "./task-form"

const AddTask= ({ teamId }) => {
  return (
    <TaskForm initialData={null} tasks={[]} teamId={teamId} />
  )
}

export default AddTask