import { jwtDecode } from 'jwt-decode';

import { useNavigate } from 'react-router-dom';

import { APP_ROUTES } from 'constants/routes';
import { setAccessToken, setTimezone, setUser } from 'store/slices/authSlice';
import { useAppDispatch } from 'store/store';
import { UserJwtPayload } from 'types/userTypes';

const useLogin = (): ((accessToken: string) => void) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogin = (accessToken: string) => {
        const { sub, userId, role, companyId, type, name, timezone } = jwtDecode<UserJwtPayload>(accessToken);

        dispatch(setUser({ email: sub, id: userId, role, companyId, type, name }));
        dispatch(setTimezone(timezone));
        dispatch(setAccessToken(accessToken));
        navigate(APP_ROUTES.schedule.main);
    };

    return handleLogin;
};

export default useLogin;
