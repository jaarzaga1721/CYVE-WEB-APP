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

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error('Server returned an unexpected response. Check backend logs.');
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Server returned an empty response.');
            }
            const data = JSON.parse(text);

            return {
                success: data.success ?? response.ok,
                message: data.message || (response.ok ? 'Success' : 'Request failed'),
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
