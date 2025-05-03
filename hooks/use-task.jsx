import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTask = (taskId) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/tasks/${taskId}`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTask