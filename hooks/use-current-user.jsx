import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useCurrentUser = () => {

    const { data, error, isLoading, mutate } = useSWR(`/api/users/profile`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useCurrentUser