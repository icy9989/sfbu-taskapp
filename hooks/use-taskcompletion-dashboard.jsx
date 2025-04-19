"use client";

import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTaskCompletionDashboardCard = () => {

    const { data, error, isLoading, mutate } = useSWR(`/api/dashboard/task-completion`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTaskCompletionDashboardCard