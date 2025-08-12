import { useDidMount } from './useDidMount';
import useLogin from './useLogin';

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UNKNOWN_ERROR } from 'constants/common';
import { AUTH_ENDPOINTS, USERS_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { authRequest } from 'services/authService';
import { LoginResponse, RecoveryFormValues } from 'types/authTypes';
import { ConfirmInviteResponse } from 'types/userTypes';

const useAuthPassword = () => {
    const navigate = useNavigate();
    const loginUser = useLogin();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    useDidMount(() => {
        if (!email || !token) navigate(APP_ROUTES.auth.login);
    });

    const [isAuthMessage, setIsAuthMessage] = useState(false);

    const activateUser = async ({ password }: RecoveryFormValues) => {
        if (!token || !email) return;

        try {
            const { meta, response } = await authRequest<ConfirmInviteResponse>({
                url: USERS_ENDPOINTS.confirmInvite,
                data: { token, password }
            });

            if (meta.success && response) loginAfterAuth(response.username, password);
            else if (meta.message) handleError(meta.message, 'Activation failed');
        } catch {
            toast.error(UNKNOWN_ERROR);
        }
    };

    const resetPassword = async ({ password }: RecoveryFormValues) => {
        if (!token || !email) return;

        try {
            const { meta } = await authRequest({
                url: AUTH_ENDPOINTS.setNewPassword,
                data: { token, password }
            });
            if (meta.success) loginAfterAuth(email, password);
            else if (meta.message) handleError(meta.message, 'Password reset failed');
        } catch {
            toast.error(UNKNOWN_ERROR);
        }
    };

    const loginAfterAuth = async (email: string, password: string) => {
        const { meta, response } = await authRequest<LoginResponse>({
            url: AUTH_ENDPOINTS.login,
            data: { email, password }
        });

        if (meta.success && response) loginUser(response.accessToken);
        else toast.error(meta.message || UNKNOWN_ERROR);
    };

    const handleError = (metaMessage: string, defaultMessage: string) => {
        if (metaMessage.includes('expired')) setIsAuthMessage(true);
        else toast.error(metaMessage || defaultMessage);
    };

    return {
        isAuthMessage,
        email,
        resetPassword,
        activateUser
    };
};

export default useAuthPassword;
