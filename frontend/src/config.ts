/**
 * Centralized API configuration for the CYVE frontend.
 * Set NEXT_PUBLIC_API_URL in .env.local (dev) or .env.production (prod).
 */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/backend/api` : 'http://127.0.0.1:8000/backend/api';
