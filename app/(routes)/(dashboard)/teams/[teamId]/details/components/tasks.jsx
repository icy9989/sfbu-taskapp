"use client"

import { ClipLoader } from "react-spinners";

import NoResult from "@/components/no-result";

import useTasks from "@/hooks/use-tasks";  // Custom hook for fetching tasks

import TaskCard from "./task-card";  // Card component for tasks
import useTeamTasks from "@/hooks/use-team-tasks";
import { useParams } from "next/navigation";

const Tasks = () => {

    const params = useParams()
    const { data: tasks, isLoading } = useTeamTasks(params.teamId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-72">
                <ClipLoader color="#6b0407" size={28} />
            </div>
        );
    }

    return (
        <>
            {tasks?.length === 0 ? (
                <NoResult text="No tasks available." width={200} height={200} />
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {tasks?.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}

        </>
    );
};

export default Tasks;
