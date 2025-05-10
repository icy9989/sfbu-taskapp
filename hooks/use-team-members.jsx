import useSWR from "swr"
// import { useSWR } from "swr"
import fetcher from "@/lib/fetcher"

const useTeamMembers = (teamId) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/teams/${teamId}/members`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTeamMembers