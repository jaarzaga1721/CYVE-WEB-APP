import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callApi = useCallback(async <T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                credentials: 'include',
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Network response was not ok');
            }

            return {
                success: true,
                message: data.message || 'Success',
                data: data,
            };
        } catch (err: any) {
            const message = err.message || 'An unexpected error occurred';
            setError(message);
            return {
                success: false,
                message,
            };
        } finally {
            setLoading(false);
        }
    }, []);

    return { callApi, loading, error };
};
