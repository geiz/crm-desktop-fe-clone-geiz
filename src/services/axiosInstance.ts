import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { AUTH_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { authRequest } from 'services/authService';
import { logout, setAccessToken } from 'store/slices/authSlice';
import { store } from 'store/store';
import { RefreshResponse } from 'types/authTypes';

const baseURL = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true // send httpOnly-cookie with refresh_token
});

// Перехватчик запросов
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const isRefreshRequest = config.url === AUTH_ENDPOINTS.refresh;
        const state = store.getState();
        const { accessToken } = state.auth;

        if (accessToken && !isRefreshRequest) config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
    },

    error => Promise.reject(error)
);

// Перехватчик ответов
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
        const originalRequest = error.config;
        // If the error status is 401 and there is no originalRequest._retry flag,
        // means the token has expired and we need to refresh it
        if (error.status === 401 && !originalRequest._retry) {
            try {
                const { meta, response } = await authRequest<RefreshResponse>({ url: AUTH_ENDPOINTS.refresh });

                if (meta.success && response) {
                    store.dispatch(setAccessToken(response.accessToken));
                    originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

                    return axiosInstance(originalRequest); // repeat request with new token
                }
            } catch (refreshError) {
                store.dispatch(logout());
                window.location.replace(APP_ROUTES.auth.login);

                return Promise.reject(refreshError);
            }
        }

        originalRequest._retry = true;

        // If the request has already been retried and still gets a 401, log out the user
        // means refresh token is expiered too
        if (error.status === 401) {
            store.dispatch(logout());
            window.location.replace(APP_ROUTES.auth.login);
        }

        if (error.status === 403) window.location.href = APP_ROUTES.forbbiden.main;

        return Promise.reject(error);
    }
);

export default axiosInstance;
