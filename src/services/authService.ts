import axiosInstance from 'services/axiosInstance';
import { AuthParams } from 'types/authTypes';
import { ApiResponse } from 'types/common';

interface AuthRequestProps {
    url: string;
    data?: AuthParams;
}

export const authRequest = async <T>({ url, data }: AuthRequestProps): Promise<ApiResponse<T>> => {
    try {
        const resp = await axiosInstance.post(url, { ...data });
        return resp.data;
    } catch (err) {
        // tost internal server error // 500
        console.error(`authRequest ${url} failed:`, err);
        throw err;
    }
};

// refresh token is taken automatically by backend from httpOnly cookies
// backend checks if refresh is valid and update it if it is not
// then  backend update and return both tokens
// from => const response = await axiosInstance.post(`auth/refresh`);
// to => const response = await authRequest({ url: AUTH_ENDPOINTS.refresh });
