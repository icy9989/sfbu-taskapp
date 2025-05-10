import useSWR from "swr"
// import { useSWR } from "swr"
import fetcher from "@/lib/fetcher"

const useTaskComments = (taskId) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/tasks/${taskId}/comments`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTaskComments