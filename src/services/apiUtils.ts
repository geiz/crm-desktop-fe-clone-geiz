import { UNKNOWN_ERROR } from 'constants/common';
import axiosInstance from 'services/axiosInstance';
import { ApiResponse, Method, PaginatedResponse, RequestParams } from 'types/common';

export async function apiRequest<T>(params: RequestParams & { withPagination: true }): Promise<PaginatedResponse<T>>;

export async function apiRequest<T>(params: RequestParams & { withPagination?: false | undefined }): Promise<T>;

export async function apiRequest<T>(params: RequestParams): Promise<unknown> {
    const { url, method, params: queryParams, data, withPagination } = params;
    try {
        const response = await axiosInstance({ url, method, params: queryParams, data });

        if (withPagination) {
            return validateApiResponse<T>(response.data, method, true);
        }

        return validateApiResponse<T>(response.data, method, false);
    } catch (err) {
        console.error(`Request to ${url} with method ${method} failed:`, err);
        throw err;
    }
}

function validateApiResponse<T>(data: ApiResponse<T>, method: string, withPagination: true): PaginatedResponse<T>;

function validateApiResponse<T>(data: ApiResponse<T>, method: string, withPagination?: false): T;

function validateApiResponse<T>(data: ApiResponse<T>, method: string, withPagination = false): T | PaginatedResponse<T> {
    if (!data?.meta?.success) {
        const errorMessage = data?.meta?.message || UNKNOWN_ERROR;
        const errorCode = data?.meta?.code || '';
        console.error(`❌ API Error: message - ${errorMessage}, code - ${errorCode}.`);
        throw new Error(errorMessage);
    }

    if (method === Method.DELETE && !data.response) {
        return 'deleted' as T;
    }

    const response = data.response as T;

    if (withPagination && data.meta.pagination) {
        return {
            data: response,
            pagination: data.meta.pagination
        };
    }

    return response;
}
