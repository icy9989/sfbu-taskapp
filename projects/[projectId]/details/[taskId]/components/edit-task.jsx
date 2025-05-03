"use client";

import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";

import NotFound from "@/components/not-found";

import useTask from "@/hooks/use-task";
import TaskForm from "./task-form";

const EditTask = () => {

    const params = useParams();
    const { data: fetchedTask, isLoading } = useTask(params.taskId);

    let task;

    if(fetchedTask) {
        task = {
            id: String(fetchedTask.id),
            title: String(fetchedTask.title),
            description: String(fetchedTask.description),
            dueDate: new Date(fetchedTask.dueDate),
            startDate: new Date(fetchedTask.startDate),
            category: String(fetchedTask.category),
            priority: String(fetchedTask.priority),
            status: String(fetchedTask.status)
        }
    } else {
        task = null;
    }

    console.log(task)


    if(isLoading) {
        return (
            <div className='flex justify-center items-center h-40'>
                <ClipLoader color='#6b0407' size={28} />
            </div>
        )
    }

    if(!isLoading && fetchedTask === undefined) {
        return (
            <NotFound text="Task not found" />
        )
    }

    return (
        <TaskForm initialData={task} />
    )
}

export default EditTask