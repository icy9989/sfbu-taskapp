import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTeams = () => {

    const { data, error, isLoading, mutate } = useSWR('/api/teams', fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTeams