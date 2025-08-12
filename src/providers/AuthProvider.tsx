import { jwtDecode } from 'jwt-decode';

import { FC, ReactNode, useEffect, useState } from 'react';

import { AUTH_ENDPOINTS } from 'constants/endpoints';
import { authRequest } from 'services/authService';
import { setAccessToken, setTimezone, setUser } from 'store/slices/authSlice';
import { useAppDispatch } from 'store/store';
import { RefreshResponse } from 'types/authTypes';
import { UserJwtPayload } from 'types/userTypes';

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [isTokenloading, setIsTokenLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchToken = async () => {
            const { meta, response } = await authRequest<RefreshResponse>({ url: AUTH_ENDPOINTS.refresh });

            if (meta.success && response) {
                const { sub, userId, role, companyId, type, name, timezone } = jwtDecode<UserJwtPayload>(response.accessToken);
                dispatch(setUser({ email: sub, id: userId, role, companyId, type, name }));
                dispatch(setTimezone(timezone));
                dispatch(setAccessToken(response.accessToken));
            }

            setIsTokenLoading(false);
        };

        fetchToken();
    }, [dispatch]);

    // first load token => then render children with interseptor
    if (isTokenloading) return <div>...loading</div>;

    return children;
};

export default AuthProvider;
