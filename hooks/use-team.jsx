import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTeam = (teamId) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/teams/${teamId}`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTeam