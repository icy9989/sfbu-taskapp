import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTask= (taskId) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/tasks/import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTasks = () => {

    const { data, error, isLoading, mutate } = useSWR('/api/tasks', fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTasks`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTask