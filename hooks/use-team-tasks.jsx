import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTeamTasks = (teamId) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/teams/${teamId}/tasks`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTeamTasks