import useSWR from "swr"
import fetcher from "@/lib/fetcher"

const useAssignMembers = (taskId) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/tasks/${taskId}/assign`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useAssignMembers