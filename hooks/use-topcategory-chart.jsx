"use client";

import useSWR from "swr"

import fetcher from "@/lib/fetcher"

const useTopCategoryChart = () => {

    const { data, error, isLoading, mutate } = useSWR(`/api/dashboard/top-category`, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useTopCategoryChart