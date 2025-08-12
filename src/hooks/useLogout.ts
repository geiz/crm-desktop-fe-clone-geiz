import { AUTH_ENDPOINTS } from 'constants/endpoints';
import { authRequest } from 'services/authService';
import { logout } from 'store/slices/authSlice';
import { useAppDispatch } from 'store/store';

const useLogout = (): (() => void) => {
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        await authRequest({ url: AUTH_ENDPOINTS.logout });
        dispatch(logout());
    };

    return handleLogout;
};

export default useLogout;
