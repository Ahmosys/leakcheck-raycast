import { useFetch } from "@raycast/utils";
import { ApiResponse } from "../types/breach";

export function useFetchBreaches(email: string, apiKey: string) {
    const { isLoading, data, error } = useFetch<ApiResponse>(
        `https://leakcheck.io/api/v2/query/${encodeURIComponent(email)}`,
        {
            headers: { "X-API-Key": apiKey },
            execute: !!email,
        }
    );

    return { isLoading, data, error };
}